package actors


import akka.actor._
import play.api.Logger
import play.api.libs.iteratee._
import play.api.libs.json.{JsObject, Json}
import play.api.libs.concurrent.Execution.Implicits.defaultContext


class WebSocketRecvActor extends Actor {

  val (enumerator, channel) = Concurrent.broadcast[String]

	def receive = {	// message를 받으면
		case Join() => {
      val iteratee = Iteratee.foreach[String] { json =>	// iteratee 연결
        self ! SendProc(json)
      }.map { _ =>	// connection이 끊길때
        self ! Leave()
      }
      sender ! Right((iteratee, enumerator))
		}

		case Leave() => {
		}

		case SendProc(json: String) => {
      channel.push(json)
    }
	}
}

case class Join()
case class Leave()
case class SendProc(json: String)


