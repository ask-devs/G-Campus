import axios from "axios";
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Loader from "./Loader";
import CountUp from "react-countup/";
import { Doughnut } from "react-chartjs-2";
import DepartmentShortener from "../../../utils/Shortener";
import user from "../../../resources/images/user.png";

const Main = () => {
  const [Students, setStudents] = useState({});
  const [faculties, setFaculties] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);
  const [chartData, setChartData] = useState([4, 1, 1]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setTimeout(() => {
      loader()
        .then((response) => {
          if (response.isSuccess) {
            console.log(response.data.studentcount);
            // setStudents(response.data);
            setStudents(response.data.studentcount);
            setDepartments({
              departmentCount: response.data.department,
              principal: response.data.headOfDept,
            });
            setFeedbacks(response.data.feedbacks);
            setFaculties(response.data.faculty);
            setChartData([
              response.data.studentcount.BCOM,
              response.data.studentcount.BBA,
              response.data.studentcount.BCA,
            ]);
            setIsLoading(false);
          }
        })
        .catch((err) => {
          console.log(err);
          setIsLoading(false);
          navigate("/admin/error");
        });
    }, 2500);
  }, [navigate]);

  const data = {
    labels: ["BCOM", "BBA", "BCA"],
    datasets: [
      {
        label: "Students",
        backgroundColor: ["#3b82f6", "#6366f1", "#c084fc"],
        // borderColor: "#a0a0a0",
        data: chartData,
      },
    ],
  };

  return isLoading ? (
    <Loader />
  ) : (
    <main className="h-auto w-[95%] m-auto my-4">
      {/* students, departments, feedbacks, faculties */}
      <section className="flex justify-evenly bg-gray-100 py-4 rounded-lg shadow-md shadow-gray-300">
        <Link className="w-[15%]" to="/admin/department">
          <h1 className="text-6xl font-medium w-ful text-center">
            <CountUp end={departments?.departmentCount ?? 0} duration={5} />
          </h1>
          <h1 className="text-xl text-center">Departments</h1>
        </Link>
        <Link className="w-[15%]" to="/admin/faculty">
          <h1 className="text-6xl font-medium w-ful text-center">
            <CountUp end={faculties?.facultyCount ?? 0} duration={5} />
          </h1>
          <h1 className="text-xl text-center">Faculties</h1>
        </Link>
        <Link className="w-[15%]" to="/admin/student">
          <h1 className="text-6xl font-medium w-ful text-center">
            <CountUp end={Students?.TOTAL ?? 0} duration={5} />
          </h1>
          <h1 className="text-xl text-center">Students</h1>
        </Link>
        <Link className="w-[15%]" to="/admin/feedback">
          <h1 className="text-6xl font-medium w-ful text-center">
            <CountUp end={feedbacks} duration={5} />
          </h1>
          <h1 className="text-xl text-center">Feedbacks</h1>
        </Link>
      </section>

      {/* faculty and student display */}
      <section className="mt-8 h-[450px] flex justify-between items-center px-1 py-5">
        <div className="w-[65%] h-full bg-gray-100 px-5 rounded-md shadow-md shadow-gray-300">
          <h1 className="text-lg px-2 pt-2 font-medium">Faculties</h1>
          <div className="w-full h-[85%] mt-2">
            <div className="h-[10%] text-lg border-b flex justify-around items-center font-medium text-center">
              <div className="w-1/6">#</div>
              <div className="w-1/6">Name</div>
              <div className="w-1/6">Gender</div>
              <div className="w-1/6">Qualifaction</div>
              <div className="w-1/6">Experience</div>
              <div className="w-1/6">Class</div>
            </div>
            <div className="h-[90%] py-2 flex flex-col gap-4 overflow-y-scroll">
              {faculties?.faculties?.map((faculty) => {
                return (
                  <div className="py-1 flex justify-around items-center text-center">
                    <div className="w-1/6 m-auto flex justify-center items-center">
                      <img
                        src={require(`../../../images/${faculty.profile}`)}
                        alt="faculty profile"
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    </div>
                    <div className="w-1/6">{faculty.fullname}</div>
                    <div className="w-1/6">{faculty.gender}</div>
                    <div className="w-1/6">{faculty.qualification}</div>
                    <div className="w-1/6">{faculty.experience} Years</div>
                    <div className="w-1/6">
                      {faculty.class + DepartmentShortener(faculty.deptId)}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        <div className="w-[30%] h-full bg-gray-100 px-5 flex flex-col justify-evenly items-center rounded-md shadow-md shadow-gray-300">
          <h1 className="w-full text-xl">Students</h1>
          <Doughnut data={data} className="" />
        </div>
      </section>

      {/* head of the departmenst */}
      <section className="mt-8 h-96 bg-slate-500">
        <h1 className="w-full px-4 pt-2 text-xl font-semibold h-[10%]">
          Heads of the Department
        </h1>
        <div className="flex justify-around items-center h-[90%]">
          {departments?.principal?.map((faculty) => {
            return (
              <div className="w-1/5 h-5/6 bg-red-400">
                
                {/**
                |--------------------------------------------------
                | design head of department cards
                |--------------------------------------------------
                **/}

                <div className="h-3/5 w-full">
                  <img
                    src={require(`../../../images/${faculty.profile}`)}
                    // src={user}
                    alt="faculty profle"
                    className="h-full w-full object-contain m-auto"
                  />
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </main>
  );
};

function loader() {
  try {
    return axios
      .get("http://localhost:5000/admin/getalldetails")
      .then((response) => {
        if (response.data) {
          return response.data;
        }
      })
      .catch((err) => {
        return err;
      });
  } catch (error) {
    return error;
  }
}

export default Main;
