import React, { useContext, useEffect } from "react";
import { Col, ListGroup, Form, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { AppContext } from "../context/appContext";
import { addNotifications, resetNotifications } from "../features/userSlice";
import "./Sidebar.css";

function Sidebar() {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const {
    socket,
    setMembers,
    members,
    setCurrentRoom,
    privateMemberMsg,
    setPrivateMemberMsg,
    currentRoom,
  } = useContext(AppContext);

  function joinRoom(room, isPublic = true) {
    if (!user) {
      return alert("Please login");
    }
    socket.emit("join-room", room, currentRoom);
    setCurrentRoom(room);

    if (isPublic) {
      setPrivateMemberMsg(null);
    }
    // dispatch for notifications
    dispatch(resetNotifications(room));
  }

  socket.off("notifications").on("notifications", (room) => {
    if (currentRoom !== room) dispatch(addNotifications(room));
  });

  useEffect(() => {
    if (user) {
      setCurrentRoom("general");
      socket.emit("new-user");
    }
  }, [user, setCurrentRoom, socket]);

  socket.off("new-user").on("new-user", (payload) => {
    setMembers(payload);
  });

  function orderIds(id1, id2) {
    if (id1 > id2) {
      return id1 + "-" + id2;
    } else {
      return id2 + "-" + id1;
    }
  }

  function handlePrivateMemberMsg(member) {
    setPrivateMemberMsg(member);
    const roomId = orderIds(user._id, member._id);
    joinRoom(roomId, false);
  }

  if (!user) {
    return <></>;
  }
  return (
    <>
      <div>
        <h2>Fillters</h2>
        <div className="filterss">
          <Form className="d-flex m-2">
            <Form.Control
              type="search"
              placeholder="Filter by City"
              className="me-2"
            />
          </Form>
          <Form className="d-flex m-2">
            <Form.Control
              type="search"
              placeholder="Filter by Route points"
              className="me-2"
            />
          </Form>
        </div>
      </div>
      <div>
        <h2>Members</h2>
        {members.map((member) => (
          <ListGroup.Item
            className="mem"
            key={member.id}
            style={{ cursor: "pointer" }}
            active={privateMemberMsg?._id === member?._id}
            onClick={() => handlePrivateMemberMsg(member)}
            hidden={member._id === user._id}
          >
            <Row>
              <Col xs={2} className="member-status">
                <img
                  src={member.picture}
                  className="member-status-img"
                  alt=""
                />
              </Col>
              <Col xs={9}>
                <h5>
                  {member.name},
                  {member.status === "offline" ? " (offline) " : " (online) "}
                </h5>
                <h6>city : {member.city}</h6>
                <p>Routes : {member.routepoints}</p>
                <p>Collage : {member.collage}</p>
              </Col>
              <Col xs={1}>
                <span className="badge rounded-pill bg-primary">
                  {user.newMessages[orderIds(member._id, user._id)]}
                </span>
              </Col>
            </Row>
          </ListGroup.Item>
        ))}
      </div>
    </>
  );
}

export default Sidebar;
