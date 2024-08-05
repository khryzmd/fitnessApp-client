// Deconstructed module
import { Button, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";

export default function Banner({ data }) {
  console.log(data);
  const { title, content, destination, buttonLabel } = data;

  return (
    <Row>
      <Col>
        <h1>{title}</h1>
        <p>{content}</p>
        <Button variant="primary" as={Link} to={destination}>
          {buttonLabel}
        </Button>
      </Col>
    </Row>
  );
}
