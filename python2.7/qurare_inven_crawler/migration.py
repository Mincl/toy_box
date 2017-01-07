



import MySQLdb
import _mysql
import json
import sys,os
import time


class WriteDB:
	def __init__(self):
		self.db = _mysql.connect(user="root",passwd="raakveak403&", host="localhost", db="qurare")

	def insertCard(self, skill_id, code, name, rarity, cost, position, category, illustrator, desc):
		self.db.query("""
			INSERT INTO card
				(skill_id, code, name, rarity, cost, position, category, illustrator, description)
				VALUES (%d, '%s', '%s', %d, %d, '%s', '%s', '%s', "%s")
			""" % (skill_id, code.encode('UTF-8'), name.encode('UTF-8'), rarity, cost, position.encode('UTF-8'), category.encode('UTF-8'), illustrator.encode('UTF-8'), desc.encode('UTF-8')))

	def cardExistCheck(self, name):
		self.db.query("""
			SELECT count(*) FROM card
				WHERE name = '%s'
			""" % name.encode('UTF-8'))
		result = self.db.store_result()
		if(result.fetch_row()[0][0] == '0'):
			return False
		else:
			return True

	def getCardId(self, name):
		self.db.query("""
			SELECT id FROM card
				WHERE name = '%s'
			""" % name.encode('UTF-8'))
		result = self.db.store_result()
		return result.fetch_row()[0][0]

	def insertCardStat(self, card_id, level, enchant_cnt, atk, hp, heal):
		self.db.query("""
			INSERT INTO card_stat
				(card_id, level, enchant_cnt, atk, hp, heal)
				VALUES (%d, %d, %d, %d, %d, %d)
			""" % (card_id, level, enchant_cnt, atk, hp, heal))

	def skillExistCheck(self, name):
		self.db.query("""
			SELECT count(*) FROM skill
				WHERE name = '%s'
			""" % name.encode('UTF-8'))
		result = self.db.store_result()
		if(result.fetch_row()[0][0] == '0'):
			return False
		else:
			return True

	def getSkillId(self, name):
		self.db.query("""
			SELECT id FROM skill
				WHERE name = '%s'
			""" % name.encode('UTF-8'))
		result = self.db.store_result()
		return result.fetch_row()[0][0]

	def insertSkill(self, name, skill_type, desc):
		self.db.query("""
			INSERT INTO skill
				(name, type, description)
				VALUES('%s', '%s', '%s')
			""" % (name.encode('UTF-8'), skill_type.encode('UTF-8'), desc.encode('UTF-8')))



qurareDB = WriteDB()
file = open('crawl.log','r')
for data in file:
	card = json.loads(data)
	if not qurareDB.skillExistCheck(card['skill_name']):
		print "insert skill : ", card['skill_name'], card['skill_type'], card['skill_description']
		qurareDB.insertSkill(card['skill_name'], card['skill_type'], card['skill_description'])
	skill_id = int(qurareDB.getSkillId(card['skill_name']))
	if not qurareDB.cardExistCheck(card['name']):
		print "insert card : ", skill_id, card['id'], card['name'], card['rarity'], card['cost'], card['position'], card['category'], card['illustrator'], card['card_description']
		qurareDB.insertCard(skill_id, card['id'], card['name'], card['rarity'], card['cost'], card['position'], card['category'], card['illustrator'], card['card_description'])
		card_id = int(qurareDB.getCardId(card['name']))
		for lev_idx in range(4):
			stat_info = card['stat_info']
			for enchant_idx in range(6):
				try:
					enchant = stat_info[lev_idx]['enchant']
					qurareDB.insertCardStat(card_id, stat_info[lev_idx]['level'], enchant_idx, enchant[enchant_idx]['atk'], enchant[enchant_idx]['hp'], enchant[enchant_idx]['heal'])
				except Exception, e:
					print 'lev error %d' % lev_idx
	else:
		print "already exist card : ", card['name']

	time.sleep(0.1)
file.close()


	
