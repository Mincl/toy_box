package models

import scala.slick.driver.MySQLDriver.simple._
import scala.slick.session.Database.threadLocalSession
import play.api.libs.json.{JsObject, Json}
import play.api.Logger
import scala.slick.session.Session
import play.api.db._
import play.api.Play.current

case class Card(id: Int,
                skillId: Int,
                code: String,
                name: String,
                rarity: Int,
                cost: Int,
                position: String,
                category: String,
                illustrator: String,
                description: String) {

  lazy val skill = Skills.findOptById(skillId) match {
      case Some(s) => s
      case _ => throw new NotFoundSkillException()
    }
}

object Cards extends Table[Card]("card") {

  def id = column[Int]("id", O.PrimaryKey)
  def skillId = column[Int]("skill_id")
  def code = column[String]("code")
  def name = column[String]("name")
  def rarity = column[Int]("rarity")
  def cost = column[Int]("cost")
  def position = column[String]("position")
  def category = column[String]("category")
  def illustrator = column[String]("illustrator")
  def description = column[String]("description")

  def * = id ~ skillId ~ code ~ name ~ rarity ~ cost ~ position ~ category ~ illustrator ~ description <> (Card.apply _, Card.unapply _)

  def findAll(): List[Card] = {
    utils.Slick.withSession {
      Query(Cards).sortBy(_.rarity.desc).list
    }
  }
}