


package controllers

import play.api._
import play.api.mvc._
import models._
import play.api.libs.json._

object qurareController extends Controller {
  
  def qurare = Action {
  	val cards = Cards.findAll()
    Ok(views.html.qurare(cards))
  }

  def deck = Action {
  	val cards = Cards.findAll()
    Ok(views.html.deck(cards))
  }

  def getStat(id: Int, enchantCnt: Int, level: Int) = Action {
  	val cardStats = CardStats.findAllByCardId(id)
	val cardEncStats = cardStats.filter(_.enchantCnt == enchantCnt)
	val statTuple = for( i <- 0 until cardEncStats.length-1) yield (cardEncStats(i), cardEncStats(i+1))
	for ( (firstStat, secondStat) <- statTuple
		if firstStat.level to secondStat.level contains level) {
		Ok(statToJson(CardStats.calcStatByLv(firstStat, secondStat, level)))
	}

  }

  private def statToJson(cardStat: CardStat): JsObject = {
  	Json.obj(
  		"level" -> cardStat.level,
  		"atk" -> cardStat.atk,
  		"hp" -> cardStat.hp,
  		"heal" -> cardStat.heal
  	)
  }
}