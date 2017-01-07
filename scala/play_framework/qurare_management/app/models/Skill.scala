package models

import scala.slick.driver.MySQLDriver.simple._
import scala.slick.session.Database.threadLocalSession
import play.api.libs.json.{JsObject, Json}
import play.api.Logger

case class Skill(id: Int,
                 name: String,
                 Type: String,
                 description: String) {
}

object Skills extends Table[Skill]("skill") {

  def id = column[Int]("id", O.PrimaryKey)
  def name = column[String]("name")
  def Type = column[String]("type")
  def description = column[String]("description")  

  def * = id ~ name ~ Type ~ description <> (Skill.apply _, Skill.unapply _)

  def findOptById(id: Int): Option[Skill] = {
    utils.Slick.withSession {
      Query(Skills).filter(l => l.id === id).firstOption
    }
  }
}