import sbt._
import Keys._
import play.Project._

object ApplicationBuild extends Build {

  val appName         = "qurare"
  val appVersion      = "1.0-SNAPSHOT"

  val appDependencies = Seq(
    // Add your project dependencies here,
    jdbc,
    anorm,
    "com.typesafe.slick" %% "slick" % "1.0.1",
    "mysql" % "mysql-connector-java" % "5.1.21"
  )


  val main = play.Project(appName, appVersion, appDependencies).settings(
    // Add your own project settings here      
  )

}
