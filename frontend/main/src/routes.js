/*!

=========================================================
* Paper Dashboard React - v1.3.0
=========================================================

* Product Page: https://www.creative-tim.com/product/paper-dashboard-react
* Copyright 2021 Creative Tim (https://www.creative-tim.com)

* Licensed under MIT (https://github.com/creativetimofficial/paper-dashboard-react/blob/main/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import Score from "views/Score.js";
import Teams from "views/Teams.js";

var routes = [
  {
    path: "/teams",
    name: "Teams",
    icon: "nc-icon nc-single-02",
    component: Teams,
    layout: "/football",
  },
  {
    path: "/score",
    name: "Score Table",
    icon: "nc-icon nc-tile-56",
    component: Score,
    layout: "/football",
  },
];
export default routes;
