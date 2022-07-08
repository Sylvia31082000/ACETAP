import React from "react";

import {
  Button,
  Card,
  CardHeader,
  CardBody,
  Table,
  CardTitle,
  FormGroup,
  Form,
  Input,
  Row,
  Col,
} from "reactstrap";

import axios from 'axios'

// const createTeam = `${process.env.REACT_APP_API_URL}/user/createUser`
// const getTeams = `${process.env.REACT_APP_API_URL}/team/getTeams`

const getScore = `${process.env.REACT_APP_API_URL}/score/getScore`
const createScore = `${process.env.REACT_APP_API_URL}/score/createScore`
const deleteTeams = `${process.env.REACT_APP_API_URL}/team/deleteTeams`


const defaultState = {
  items: [],
  firstGroup: [],
  secondGroup: [],
  text: "",
  played: false
}

class Score extends React.Component {
  constructor(props) {
    super(props)
    this.state = defaultState
    this.handleInputChange = this.handleInputChange.bind(this)
  }

  componentDidMount() {
    axios.post(getScore, {}, {}).then(res=> {
        console.log(res.data)
        const name = "items"
        var items = res.data
        var firstTeam = items[0].teamNumber
        var first = []
        var second = []
        var played = items[0].alternateScore != undefined
        console.log(items[0].alternateScore)
        for (var item of items) {
          if (item.teamNumber == firstTeam) {
            first.push(item)
          } else {
            second.push(item)
          }
        }

        // Sort in terms of score
        first.sort(function (a, b) {
          if (a.score > b.score) return -1
          if (a.score < b.score) return 1
          if (a.goals > b.goals) return -1
          if (a.goals < b.goals) return 1
          if (a.alternateScore > b.alternateScore) return -1
          if (a.alternateScore < b.alternateScore) return 1
          if (a.registrationDate > b.registrationDate) return -1
          if (a.registrationDate < b.registrationDate) return 1

          var aDate = a.registrationDate.split("/")
          var bDate = b.registrationDate.split("/")

          if ((Number(aDate[1]) < Number(bDate[1]))|| (Number(aDate[1]) == Number(bDate[1]) && (Number(aDate[1]) < Number(bDate[1])))) return -1
          if ((Number(aDate[1]) > Number(bDate[1]))|| (Number(aDate[1]) == Number(bDate[1]) && (Number(aDate[1]) > Number(bDate[1])))) return 1
        });
        second.sort(function (a, b) {
          if (a.score > b.score) return -1
          if (a.score < b.score) return 1
          if (a.goals > b.goals) return -1
          if (a.goals < b.goals) return 1
          if (a.alternateScore > b.alternateScore) return -1
          if (a.alternateScore < b.alternateScore) return 1

          var aDate = a.registrationDate.split("/")
          var bDate = b.registrationDate.split("/")

          if ((Number(aDate[1]) < Number(bDate[1]))|| (Number(aDate[1]) == Number(bDate[1]) && (Number(aDate[1]) < Number(bDate[1])))) return -1
          if ((Number(aDate[1]) > Number(bDate[1]))|| (Number(aDate[1]) == Number(bDate[1]) && (Number(aDate[1]) > Number(bDate[1])))) return 1
        });

        this.setState({
          ["items"]: items,
          ["firstGroup"]: first,
          ["secondGroup"]: second,
          ["played"]: played
        });
        console.log(this.state.firstGroup)
        console.log(this.state.secondGroup)
        return res.data
      }).catch(err => {
        console.log("An error occured while trying to create new teams.")
      })
  }

  clearData() {
    axios.post(deleteTeams, {}, {}).then(res=> {
      console.log(res)
      window.location.reload(false)
    }).catch(err => {
      console.log("An error occured while trying to create new teams.")
    })
  }

  handleInputChange(event) {
    const target = event.target
    var value = target.value
    const name = target.name
    this.setState({
      [name]: value
    });
  }


  submit() {
      console.log("HI");
      console.log("this.state.text");

      const requestBody = {
        text: this.state.text
      }
      axios.post(createScore, requestBody, {}).then(res=> {
        console.log(res)
        window.location.reload(false)

      }).catch(err => {
        console.log("An error occured while trying to create new teams.")
      })
  }

  qualify(rank) {
    return (rank > 4) ? "No" : "Yes"
  }

  getText() {
    return this.state.items.length > 0 ? "Please update scores before rank is shown" : "Please register for teams and update scores before rank is shown"
  }

  render() {
    var count = 0
    var countSecond = 0
    return (
      <>
        <div className="content">
        <Row>
            <Col md="12">
              <Card className="card-user">
                <CardHeader>
                  <CardTitle tag="h5">Update Score</CardTitle>
                </CardHeader>
                <CardBody>
                  <Form>
                    <Row>
                      <Col md="12">
                        <FormGroup>
                          <label>Score Information</label>
                          <Input
                            type="textarea"
                            name="text"
                            placeholder="<Team A name> <Team B name> <Team A goals scored> <Team B goals scored> e.g., firstTeam secondTeam 0 3"
                            value={this.state.text} 
                            onChange={this.handleInputChange}
                          />
                        </FormGroup>
                      </Col>
                    </Row>
                    <Row>
                      <div className="update ml-auto mr-auto">
                        { this.state.items.length > 0 ? this.state.played ?
                        <Button
                          className="btn-round"
                          color="danger"
                          type="submit"
                          onClick={()=>this.submit()}
                          disabled
                      >
                        Score Updated
                      </Button>
                      :
                      <Button
                        className="btn-round"
                        color="primary"
                        type="submit"
                        onClick={()=>this.submit()}
                      >
                        Update
                      </Button>
                      :
                      <Button
                          className="btn-round"
                          color="danger"
                          type="submit"
                          onClick={()=>this.submit()}
                          disabled
                        >
                          Register Teams Before Proceeding
                        </Button>
                        }
                      </div>
                    </Row>
                  </Form>
                </CardBody>
              </Card>
            </Col>
          </Row>
        { this.state.played ? <Button
          className="btn-round"
          color="primary"
          type="submit"
          onClick={()=>this.clearData()}
        >
          Clear Data
        </Button> :
        <></>}
        { this.state.played ? 
        <Row>
        <Col md = "6">
        <Card className="card-user">
        <CardHeader>
              <CardTitle tag="h5">Group 1</CardTitle>
            </CardHeader>
            <CardBody>
            <Table responsive>
                <thead className="text-primary">
                  <tr>
                    <th>Rank</th>
                    <th>Team Name</th>
                    <th>Qualified</th>
                  </tr>
                </thead>
                <tbody>
                {this.state.firstGroup.map((item =>
                    <tr>
                      <td>{++count}</td>
                      <td>{item.teamName}</td>
                      <td>{this.qualify(count)}</td>
                    </tr>
                ))}
                </tbody>
              </Table>
            </CardBody>
        </Card>

        </Col>
        <Col md = "6">
        <Card className="card-user">
        <CardHeader>
              <CardTitle tag="h5">Group 2</CardTitle>
            </CardHeader>
            <CardBody>
            <Table responsive>
                <thead className="text-primary">
                  <tr>
                    <th>Team Number</th>
                    <th>Team Name</th>
                    <th>Qualified</th>
                  </tr>
                </thead>
                <tbody>
                {this.state.secondGroup.map((item =>
                    <tr>
                      <td>{++countSecond}</td>
                      <td>{item.teamName}</td>
                      <td>{this.qualify(countSecond)}</td>
                    </tr>
                ))}
                </tbody>
              </Table>
            </CardBody>
        </Card>

        </Col>
      </Row>
      : 
      <Row>
        <Col md = "12">
        <Card className="card-user">
        <CardHeader>
              <CardTitle tag="h6">{this.getText()}</CardTitle>
            </CardHeader>
        </Card>

        </Col>
        
      </Row>
      }
          
        </div>
      </>
    );
  }
}

export default Score;
