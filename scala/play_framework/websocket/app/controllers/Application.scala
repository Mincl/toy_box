package controllers

import akka.actor._
import akka.pattern.ask
import akka.util.Timeout
import play.api.libs.json.Json
import play.api.mvc._
import play.api.libs.iteratee._
import play.api.libs.concurrent.Akka
import play.api.Logger
import play.api.Play.current
import play.api.libs.concurrent.Execution.Implicits.defaultContext
import scala.concurrent.Future
import scala.concurrent.duration._

import actors.{SendProc, Join, WebSocketRecvActor}

import scala.util.Random

object Application extends Controller {

  implicit val timeout = Timeout(1 seconds)
	var room = Map[Int, ActorRef]()

  def index = Action {
  	for(r <- room) {
  		Logger.info("Room [session:%s]".format(r._1))
  	}
    Ok(views.html.index.render(room))
  }

  def createChatRoom = Action {
    val profileId = Random.nextInt
    room += (profileId -> Akka.system.actorOf(Props(classOf[WebSocketRecvActor])))
  	Logger.info("create room [session:%s]".format(profileId))
  	Ok("")
  }

  def recv(profileId: Int) = WebSocket.tryAccept[String] { request =>
    try {
      val channelFuture = room(profileId).asInstanceOf[ActorRef] ? Join()
      channelFuture.mapTo[Either[Result, (Iteratee[String, _], Enumerator[String])]]
    } catch {
      case e: Exception =>
        Future {
          Left(Ok("Failed"))
        }
    }
  }

  def noti(profileId: Int) = Action {
    room(profileId).asInstanceOf[ActorRef] ! SendProc(Json.obj("profileId" -> 0, "msg" -> "NOTICE!!!!!!!!!!").toString)
    Ok("")
  }
}

