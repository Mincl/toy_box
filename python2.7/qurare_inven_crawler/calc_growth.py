



import MySQLdb
import _mysql
import json
import sys,os
import time


class QurareDB:
	def __init__(self):
		self.db = _mysql.connect(user="root",passwd="raakveak403&", host="localhost", db="qurare")

	def getCardStats(self, rarity, cost, position, enchant_cnt):
		self.db.query("""
			SELECT c.id, c.name, c.rarity, c.cost, c.position, cs.enchant_cnt, cs.level, cs.atk, cs.hp, cs.heal
				FROM card c
				INNER JOIN card_stat cs
				ON cs.card_id=c.id
				WHERE c.rarity=%d AND c.cost=%d AND c.position='%s' AND cs.enchant_cnt=%d
				ORDER BY name, enchant_cnt, level
			""" % (rarity, cost, position, enchant_cnt))
		result = self.db.store_result()
		recordSet = []
		while 1 :
			r = result.fetch_row()
			if not r :
				break
			recordSet += r
		return recordSet
		



qurareDB = QurareDB()

# some input
rarity = input('rarity : ')
cost = input('cost : ')
position = raw_input('position : ')
enchant_cnt = input('enchant_cnt : ')

stats = qurareDB.getCardStats(rarity, cost, position, enchant_cnt)

statList = []
for stat in stats:
	statList.append({
			'id': int(stat[0]),
			'name': stat[1],
			'rarity': int(stat[2]),
			'cost': int(stat[3]),
			'position': stat[4],
			'enchant_cnt': int(stat[5]),
			'level': int(stat[6]),
			'atk': int(stat[7]),
			'hp': int(stat[8]),
			'heal': int(stat[9])
		})

for idx in range(len(statList)-1):
	# id, name, rarity, cost, position, enchant_cnt, level, atk, hp, heal
	if idx == 0 or statList[idx-1]['name'] != statList[idx]['name']:
		print ""
		print statList[idx]['name'] + '[' + ('*' * statList[idx]['rarity']) + '] / %d' % statList[idx]['cost']
		print '%d enchanted' % statList[idx]['enchant_cnt']

	if statList[idx]['name'] == statList[idx+1]['name']:
		print "%3d ~ %3d : ATK [%f]" % (statList[idx]['level'], statList[idx+1]['level'], ((statList[idx+1]['atk'] - statList[idx]['atk']) / (float)(statList[idx+1]['level'] - statList[idx]['level'])))
		print "            HP [%f]" % ((statList[idx+1]['hp'] - statList[idx]['hp']) / (float)(statList[idx+1]['level'] - statList[idx]['level']))
		print "            HEAL [%f]" % ((statList[idx+1]['heal'] - statList[idx]['heal']) / (float)(statList[idx+1]['level'] - statList[idx]['level']))
