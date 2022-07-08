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

const getScore = `${process.env.REACT_APP_API_URL}/score/getScore`
const createTeam = `${process.env.REACT_APP_API_URL}/team/createTeam`
const deleteTeams = `${process.env.REACT_APP_API_URL}/team/deleteTeams`


const defaultState = {
  text: "",
  teams: []
}

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
  // validate() {
  //   let emailError = ""
  //   let passwordError = ""
  //   let firstNameError = ""
  //   let lastNameError = ""

  //   const reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
    
  //   if (!this.state.email || reg.test(this.state.email) === false) {
  //     emailError = "Email Field is Invalid "
  //   }
  
  //   if (!this.state.password) {
  //     passwordError = "Password field is required"
  //   }

  //   if (!this.state.firstName) {
  //       firstNameError = "First name is required"
  //   }

  //   if (!this.state.lastName) {
  //       firstNameError = "Last name is required"
  //   }

  //   const requestBody = {
  //       email: this.state.email
  //     }

  //   axios.post(getUserUrl, requestBody, requestConfig).then(res=> {
  //       if (res.data.Item.length != 0) {
  //           let emailError = "Email already exist, please try again."
  //           this.setState({emailError})
  //       }

  //       if (emailError || passwordError || firstNameError || lastNameError) {
  //           this.setState({emailError, passwordError, firstNameError, lastNameError})
  //           return false;
  //       }
      
  //       return true;

  //     }).catch(err => {
  //       console.log("An error occured while trying to get user account.")
  //     })
  // }

  clearData() {
    axios.post(deleteTeams, {}, {}).then(res=> {
      console.log(res)
      window.location.reload(false)
    }).catch(err => {
      console.log("An error occured while trying to create new teams.")
    })
  }


  submit() {
    // if (this.validate()) {
      console.log("HI");
      console.log("this.state.text");

      const requestBody = {
        text: this.state.text
      }
      axios.post(createTeam, requestBody, {}).then(res=> {
        console.log(res)
        window.location.reload(false)
        // let createMessage = res.data.message
        // this.setState({createMessage})
      }).catch(err => {
        console.log("An error occured while trying to create new teams.")
      })
    // }
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
                            onChange={this.handleInputChange}
                          />
                        </FormGroup>
                      </Col>
                    </Row>
                    <Row>
                      <div className="update ml-auto mr-auto">
                        {this.state.teams.length == 12 ? <Button
                          className="btn-round"
                          color="danger"
                          type="submit"
                          onClick={()=>this.submit()}
                          disabled
                        >
                        Full
                        </Button> : 
                        <Button
                        className="btn-round"
                        color="primary"
                        type="submit"
                        onClick={()=>this.submit()}
                      >
                        Create Teams
                      </Button>}
                      </div>
                    </Row>
                  </Form>
                </CardBody>
              </Card>
            </Col>
            { this.state.teams.length > 0 ? 
            <Col md = "6">
            <Card className="card-user">
            <CardHeader>
                <CardTitle tag="h5">List of Teams</CardTitle>
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
                  <Row>
                      <div className="update ml-auto mr-auto">
                        <Button
                          className="btn-round"
                          color="primary"
                          type="submit"
                          onClick={()=>this.clearData()}
                        >
                          Clear Teams
                        </Button>
                      </div>
                    </Row>
                </CardBody>
            </Card>
  
            </Col>
            :
            <></>}
            
          </Row>
        </div>
      </>
    );
  }
}

export default Teams;
