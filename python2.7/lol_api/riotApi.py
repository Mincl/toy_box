#! /usr/bin/python


import sys
import os


host = "https://kr.api.pvp.net"
api_key = "?api_key=f893ff93-1d1a-4f7c-80ca-12db7f465655"

def main(argv):
	url = ""
	if argv[0] == "getSummoner":
		url = getSummoner(argv[1], "kr")
	if argv[0] == "getRanked":
		url = getRanked(argv[1], "kr")
	if argv[0] == "getSummary":
		url = getSummary(argv[1], "kr")
	if argv[0] == "getMatchHistory":
		url = getMatchHistory(argv[1], "kr")
	if argv[0] == "getMatch":
		url = getMatch(argv[1], "kr")
	if argv[0] == "getGame":
		url = getGame(argv[1], "kr")
	
	os.system('curl --request GET ' + url + api_key)

def getSummoner(name, region):
	return getVPath("summoner", region) + "/summoner/by-name/" + name

def getRanked(id, region):
	return getVPath("stats", region) + "/stats/by-summoner/" + id + "/ranked"

def getSummary(id, region):
	return getVPath("stats", region) + "/stats/by-summoner/" + id + "/summary"

def getMatchHistory(id, region):
	return getVPath("match", region) + "/matchhistory/" + id

def getMatch(matchId, region):
	return getVPath("match", region) + "/match/" + matchId

def getGame(id, region):
	return getVPath("game", region) + "/game/by-summoner/" + id + "/recent"

def getVPath(typeName, region):
	base_path = host + "/api/lol/" + region
	if typeName == "champion":
		return base_path + "/v1.2"
	if typeName == "game":
		return base_path + "/v1.3"
	if typeName == "league":
		return base_path + "/v2.5"
	if typeName == "static-data":
		return "/api/lol/static-data/" + region + "/v1.2"
	if typeName == "match":
		return base_path + "/v2.2"
	if typeName == "stats":
		return base_path + "/v1.3"
	if typeName == "summoner":
		return base_path + "/v1.4"

if __name__ == "__main__":
	main(sys.argv[1:])

