import json




f = open('champs', 'r')
fw = open('champResult', 'w')
jsonStr = f.read()

jsonObj = json.loads(jsonStr)
result = []
for key, value in jsonObj["data"].iteritems():
	result.append("\"%d\":{\"title\":\"%s\",\"name\":\"%s\",\"key\":\"%s\"}" % (value["id"], value["title"], value["name"], value["key"]))

fw.write(u",\n".join(result).encode('utf-8'))
