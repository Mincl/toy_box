import http.client, urllib.parse
import json

host = "api.coinone.co.kr"
headers = {"Content-type": "application/json"}

conn = http.client.HTTPSConnection(host)
conn.request("GET", "/ticker?currency=etc", headers=headers)
response = conn.getresponse()

prev_diff_str = ""

monitor = "%d(%s) " % (response.status, response.reason)
if response.status == 200:
    res_body = str(response.read(), 'utf-8')
    data = json.loads(res_body)
    monitor = monitor + ("- %s(%s)\n" % (data["errorCode"], data["result"]))
    if data["result"] == "success":
        monitor = monitor + ("  high - %s\n" % data["high"])
        monitor = monitor + ("  low - %s\n" % data["low"])
        monitor = monitor + ("  last - %s\n" % data["last"])
        monitor = monitor + ("  first - %s\n" % data["first"])
        monitor = monitor + ("  volume - %s\n" % data["volume"])
        monitor = monitor + ("  timestamp - %s\n" % data["timestamp"])
        monitor = monitor + ("  currency - %s\n" % data["currency"])
    
print(monitor)
conn.close()
