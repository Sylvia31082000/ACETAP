import React from "react";
import { Button, Card, CardHeader, CardBody, Table, CardTitle, FormGroup, Form, Input, Row, Col } from "reactstrap";
import axios from 'axios'

const getScore = `${process.env.REACT_APP_API_URL}/score/getScore`
const createTeam = `${process.env.REACT_APP_API_URL}/team/createTeam`
const deleteTeams = `${process.env.REACT_APP_API_URL}/team/deleteTeams`


const defaultState = {
  text: "",
  teams: [],
  message: "",
  status: ""
}

// Team view, to allow users to register for teams and view a table of teams
class Teams extends React.Component {
  constructor(props) {
    super(props)
    this.state = defaultState
    this.handleInputChange = this.handleInputChange.bind(this)
  }

  handleInputChange(event) {
    const target = event.target
    var value = target.value
    const name = target.name
    this.setState({
      [name]: value
    });
  }
  
  // To retrieve all teams
  componentDidMount() {
    axios.post(getScore, {}, {}).then(res=> {
      console.log(res.data)
      var arr = res.data

      this.setState({
        ["teams"]: arr
      });

      return res.data
    }).catch(err => {
      console.log("An error occured while trying to create new teams.")
    })
  }

  // To remove previously inputted teams from the database
  clearData() {
    axios.post(deleteTeams, {}, {}).then(res=> {
      console.log(res)
      this.setState({
        ["teams"]: [],
        ["message"]: res.data,
        ["status"]: "success"
      });
    }).catch(err => {
      this.setState({
        ["message"]: err.data,
        ["status"]: "error"
      });
    })
  }

  // To submit teams for registtration
  submit() {
    const requestBody = {
      text: this.state.text
    }
    axios.post(createTeam, requestBody, {}).then(messageRes=> {
      axios.post(getScore, {}, {}).then(res=> {
        console.log(res.data)
        var arr = res.data

        this.setState({
          ["teams"]: arr
        });
        console.log(this.state.status)
        console.log(this.state.message)

      }).catch(err => {

        console.log("An error occured while trying to create new teams.")
      })
    }).catch(err => {
      console.log("An error occured while trying to create new teams.")
    })
  }

  // To refresh the current state of teams
  refresh () {
    axios.post(getScore, {}, {}).then(res=> {
      console.log(res.data)
      var arr = res.data

      this.setState({
        ["teams"]: arr
      });
      console.log(this.state.status)
      console.log(this.state.message)

    }).catch(err => {
      console.log("An error occured while trying to create new teams.")
    })
  }

  render() {
    return (
      <>
        <div className="content">
          <Row>
            <Col md="6">
              <Card className="card-user">
                <CardHeader>
                  <CardTitle tag="h5">Create Teams</CardTitle>
                </CardHeader>
                <CardBody>
                  <Form>
                    <Row>
                      <Col md="12">
                        <FormGroup>
                          <label>Fill in Team Information</label>
                          <Input
                            type="textarea"
                            name="text"
                            placeholder="<Team A name> <Team A registration date in DD/MM> <Team A group number> e.g., firstTeam 17/05 2"
                            value={this.state.text} 
                            onChange={this.handleInputChange}/>
                        </FormGroup>
                      </Col>
                    </Row>
                    <Row>
                      <div className="update ml-auto mr-auto">
                        {this.state.teams.length == 12 ? 
                        <Button
                          className="btn-round"
                          color="danger"
                          type="submit"
                          onClick={()=>this.submit()}
                          disabled>
                          Full
                        </Button> 
                        : 
                        <Button
                          className="btn-round"
                          color="primary"
                          type="submit"
                          onClick={()=>this.submit()}>
                          Create Teams
                        </Button>}
                      </div>
                    </Row>
                  </Form>
                </CardBody>
              </Card>
            </Col>
            <Col md = "6">
              <Card className="card-user">
                <CardHeader>
                  <CardTitle tag="h5">List of Teams</CardTitle>
                  <Button
                    className="btn-round"
                    color="warning"
                    type="submit"
                    onClick={()=>this.refresh()}>
                    Refresh
                  </Button>
                </CardHeader>
                <CardBody>
                  <Table responsive>
                    <thead className="text-primary">
                      <tr>
                        <th>Team Name</th>
                        <th>Registration Date</th>
                        <th>Team Number</th>
                      </tr>
                    </thead>
                    <tbody>
                    {this.state.teams.map((item =>
                        <tr>
                          <td>{item.teamName}</td>
                          <td>{item.registrationDate}</td>
                          <td>{item.teamNumber}</td>
                        </tr>
                    ))}
                    </tbody>
                  </Table>
                  { this.state.teams.length > 0 ? 
                  <Row>
                    <div className="update ml-auto mr-auto">
                      <Button
                        className="btn-round"
                        color="primary"
                        type="submit"
                        onClick={()=>this.clearData()}>
                        Clear Teams
                      </Button>
                    </div>
                  </Row>
                  :
                  null }   
                </CardBody>
              </Card>
            </Col>
          </Row>
        </div>
      </>
    );
  }
}

export default Teams;
