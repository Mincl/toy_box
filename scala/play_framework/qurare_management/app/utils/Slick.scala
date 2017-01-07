package utils

import play.api.db.DB
import scala.slick.lifted._
import scala.slick.session._
import play.api.Play.current

object Slick extends Slick {
  def apply(name: String) = new Slick { override def DBName = name }
}

trait Slick {

  protected def DBName = "default"

  val database = Database.forDataSource(DB.getDataSource(DBName))

  def withTransaction[T](f: => T) = database.withTransaction(f)

  def withSession[T](f: => T) = database.withSession(f)

  def withTransaction[T](f: Session => T) = database.withTransaction(f)

  def withSession[T](f: Session => T) = database.withSession(f)
}
