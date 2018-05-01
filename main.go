package main

import (
	"bytes"
	"encoding/json"
	"io/ioutil"
	"log"
	"net"
	"net/http"
	"os"
	"path/filepath"
	"regexp"
	"strconv"
	"strings"

	"github.com/elazarl/goproxy"
)

func GetLocalIP() string {
	addrs, err := net.InterfaceAddrs()
	if err != nil {
		return ""
	}
	for _, address := range addrs {
		// check the address type and if it is not a loopback the display it
		if ipnet, ok := address.(*net.IPNet); ok && !ipnet.IP.IsLoopback() {
			if ipnet.IP.To4() != nil {
				return ipnet.IP.String()
			}
		}
	}
	return ""
}

type rule struct {
	Hook        string `json: "hook"`
	Target      string `json: "target"`
	Pattern     string `json: "pattern"`
	Replacement string `json: "replacement"`
}
type filter struct {
	Host string `json: "host"`
	Url  string `json: "url"`
}
type compiledFilter struct {
	Host *regexp.Regexp
	Url  *regexp.Regexp
}
type modifier struct {
	Filter filter `json: "filter"`
	Rules  []rule `json: "rules"`
}

type config struct {
	Comment   string     `json: "comment"`
	Port      int        `json: "port"`
	Modifiers []modifier `json: "modifiers"`
}

func readConfigs() []config {
	configPath := "." + string(filepath.Separator) + "config"
	files, _ := ioutil.ReadDir(configPath)
	result := make([]config, 0)
	for _, file := range files {
		if (!file.IsDir()) && (strings.HasSuffix(file.Name(), ".json")) {
			raw, err := ioutil.ReadFile(configPath + string(filepath.Separator) + file.Name())
			if err != nil {
				panic(err)
			}
			tmp := new(config)
			json.Unmarshal(raw, &tmp)
			result = append(result, *tmp)
		}
	}
	return result
}

func ReqMatches(filters ...*compiledFilter) goproxy.ReqConditionFunc {
	return func(req *http.Request, ctx *goproxy.ProxyCtx) bool {
		for _, compiled := range filters {
			if compiled.Host.MatchString(req.Host) && compiled.Url.MatchString(req.URL.Path) {
				return true
			}
		}
		return false
	}
}

func filterCompiler(f filter) *compiledFilter {
	result := new(compiledFilter)
	result.Host = regexp.MustCompile(f.Host)
	result.Url = regexp.MustCompile(f.Url)
	return result
}
func main() {
	configs := readConfigs()
	proxies := make([]*goproxy.ProxyHttpServer, len(configs))
	for i, config := range configs {
		proxies[i] = goproxy.NewProxyHttpServer()
		compiledFilters := make([]*compiledFilter, 0)
		for _, modify := range config.Modifiers {
			tmpCompiled := filterCompiler(modify.Filter)
			compiledFilters = append(compiledFilters, tmpCompiled)
			// onRequest here
			rs := make([]rule, 0)
			for _, r := range modify.Rules {
				if r.Hook == "onRequest" {
					rs = append(rs, r)
				}
			}
			proxies[i].OnRequest(ReqMatches(tmpCompiled)).DoFunc(
				func(req *http.Request, ctx *goproxy.ProxyCtx) (*http.Request, *http.Response) {
					// modify to get new request here.
					for _, r := range rs {
						if r.Target == "url" {
							req.Host = string(regexp.MustCompile(r.Pattern).ReplaceAll([]byte(req.Host), []byte(r.Replacement)))
						} else if r.Target == "body" {
							body, err := ioutil.ReadAll(req.Body)
							if err == nil {
								modifiedBody := regexp.MustCompile(r.Pattern).ReplaceAll(body, []byte(r.Replacement))
								req.Body = ioutil.NopCloser(bytes.NewBuffer(modifiedBody))
							}
						}
					}
					return req, nil
				})
		}
		if len(os.Args) > 1 && os.Args[1] == "server" {
			proxies[i].Verbose = false
			proxies[i].OnRequest(goproxy.Not(ReqMatches(compiledFilters...))).DoFunc( // allow the request we need only
				func(r *http.Request, ctx *goproxy.ProxyCtx) (*http.Request, *http.Response) {
					return r, goproxy.NewResponse(r, goproxy.ContentTypeText, http.StatusForbidden, "abuse of this vps is not allowed!")
				})
			proxies[i].OnRequest(goproxy.Not(goproxy.ReqHostMatches(regexp.MustCompile(":80$")))).HandleConnect(goproxy.AlwaysReject) // forbid every non-80 port
		} else {
			proxies[i].Verbose = true
		}
	}

	if len(os.Args) > 1 && os.Args[1] == "server" {
		log.Println("discord-lite, working in server mode")
	} else {
		log.Println("discord-lite, working in PC mode")
	}

	for i, config := range configs {
		for _, modify := range config.Modifiers {
			tmpCompiled := filterCompiler(modify.Filter)
			rs := make([]rule, 0)
			for _, r := range modify.Rules {
				if r.Hook == "onResponse" {
					rs = append(rs, r)
				}
			}
			proxies[i].OnResponse(ReqMatches(tmpCompiled)).DoFunc(
				func(resp *http.Response, ctx *goproxy.ProxyCtx) *http.Response {
					for _, r := range rs {
						if r.Target == "body" {
							body, err := ioutil.ReadAll(resp.Body)
							if err == nil {
								modifiedBody := regexp.MustCompile(r.Pattern).ReplaceAll(body, []byte(r.Replacement))
								resp.Body = ioutil.NopCloser(bytes.NewBuffer(modifiedBody))
							}
						}
					}
					return resp
				})
		}
		log.Printf("Proxy #%d, address: %s:%d, %s", i, GetLocalIP(), config.Port, config.Comment)
		go http.ListenAndServe(":"+strconv.Itoa(config.Port), proxies[i])
	}
	http.Handle("/", http.FileServer(http.Dir("."+string(filepath.Separator)+"PACFile")))
	http.ListenAndServe(":3000", nil)
}
