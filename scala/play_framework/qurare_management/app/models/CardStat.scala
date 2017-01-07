package models

import scala.slick.driver.MySQLDriver.simple._
import scala.slick.session.Database.threadLocalSession
import play.api.libs.json.{JsObject, Json}
import play.api.Logger

case class CardStat(cardId: Int,
                    level: Int,
                    enchantCnt: Int,
                    atk: Int,
                    hp: Int,
                    heal: Int) {
}

object CardStats extends Table[CardStat]("card_stat") {

  def cardId = column[Int]("card_id", O.PrimaryKey)
  def level = column[Int]("level", O.PrimaryKey)
  def enchantCnt = column[Int]("enchant_cnt", O.PrimaryKey)
  def atk = column[Int]("atk")
  def hp = column[Int]("hp")
  def heal = column[Int]("heal")

  def * = cardId ~ level ~ enchantCnt ~ atk ~ hp ~ heal <> (CardStat.apply _, CardStat.unapply _)

  def calcStatByLv(firstStat: CardStat, secondStat: CardStat, lv: Int): CardStat = {
    val lvFactor = lv - firstStat.level
    val lvInterval = secondStat.level - firstStat.level
    CardStat(firstStat.cardId, lv, firstStat.enchantCnt,
        (secondStat.atk - firstStat.atk) * lvFactor / lvInterval + firstStat.atk,
        (secondStat.hp - firstStat.hp) * lvFactor / lvInterval + firstStat.hp,
        (secondStat.heal - firstStat.heal) * lvFactor / lvInterval + firstStat.heal)
  }

  def findAllByCardId(cardId: Int): List[CardStat] = {
    utils.Slick.withSession {
      Query(CardStats).filter(l => l.cardId === cardId)
        .sortBy(_.level.asc)
        .list
      }
  }
}