package models



case class ServiceException(message: String) extends Exception(message)

class NotFoundSkillException(override val message: String = "Not Found Skill") extends ServiceException(message)
