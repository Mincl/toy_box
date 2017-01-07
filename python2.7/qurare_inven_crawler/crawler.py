

import sys,os
import urllib
import json
import time
from bs4 import BeautifulSoup

card_json = '{ "id" : "%s", "name" : "%s", "rarity" : %d, "cost" : %d, "position" : "%s", "skill_type" : "%s", "category" : "%s", "illustrator" : "%s", "skill_name" : "%s", "skill_description" : "%s", "card_description" : "%s", "stat_info" : [ %s ] }'
stat_json = '{"level":%d, "enchant":[%s]}'
enchant_json = '{"atk":%d, "hp":%d, "heal":%d}'

path = "http://qurare.inven.co.kr/dataninfo/card/detail.php?code=%s"


def getRarity(class_list):
	for class_name in class_list:
		if class_name.startswith('rarity'):
			return class_name[6:]

def getCost(span_list):
	classes = ""
	for span in span_list:
		if(span.get('class')[0] != 'spaceHalf'):
			classes += span.get('class')[0]
	classes = classes.replace('n','')
	return ''.join(reversed(classes))

def getStatJson(statInfo):
	stat_str = []
	for i in range(4):
		level = statInfo[i].text
		if(level == '-'):
			continue
		enchant_str = []
		enchant_atk = statInfo[i+4]
		enchant_hp = statInfo[i+8]
		for enchant_cnt in range(6):
			atk = enchant_atk.find('span', attrs={'class':'enchant%d'%enchant_cnt}).text
			hp = enchant_hp.find('span', attrs={'class':'enchant%d'%enchant_cnt}).text
			heal = (int(atk) + int(hp)) / 2
			enchant_str.append(enchant_json % (int(atk), int(hp), heal))
		stat_str.append(stat_json % (int(level), ",".join(enchant_str)))
	return ",".join(stat_str)

rarity_list = ["10%02d", "20%02d", "30%02d", "40%02d", "50%02d", "60%02d"]

for card_num in range(100):
	for prefix in rarity_list:
		card_id = prefix % (card_num)

		data = urllib.urlopen(path % card_id)
		soup = BeautifulSoup(data)
		if(soup.find(id='err404')):
			continue
		else:
			name = soup.find('div', attrs={'class':'cardName'}).text
			rarity = getRarity(soup.find('div', attrs={'class':'qurareCardImage'}).find('div',attrs={'class':'cardSetting'}).get('class'))
			cost = getCost(soup.find('div', attrs={'class':'cardCost'}).findAll('span'))
			infoRight = soup.find('div', attrs={'class':'infoRight'})

			dbCommonList = infoRight.findAll('div', attrs={'class':'qurareDbCommonList'})
			baseInfo = dbCommonList[0].findAll('td')
			position = baseInfo[0].text
			skill_type = baseInfo[1].text
			category = baseInfo[2].text
			illustrator = baseInfo[3].text

			statInfo = dbCommonList[1].findAll('td')
			stat_info = getStatJson(statInfo)

			skillInfo = dbCommonList[2]
			skill_name = skillInfo.find('th').text
			skill_description = skillInfo.find('td').text

			cardInfo = infoRight.findAll('div', attrs={'class':'wrap'})[1]
			card_description = cardInfo.find('span').text.replace('\"', '"').replace("\'","'")

			print (card_json % (card_id, name, int(rarity), int(cost), position, skill_type, category, illustrator, skill_name, skill_description, card_description, stat_info)).encode('UTF-8')
	time.sleep(0.1)

# some_data = soup.findAll('tag', attrs = {'attr':'value'})
# child_data = some_data[index].find('tag').get('attr') # value return




