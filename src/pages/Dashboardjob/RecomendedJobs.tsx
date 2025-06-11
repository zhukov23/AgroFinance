// import React, { useMemo } from "react";
// import { Col, Card, CardBody, CardHeader, Row } from "reactstrap";
// import TableContainer from "../../Components/Common/TableContainerReactTable";
// const RecomendedJobs = () => {
//   const data = [
//     {
//       id: 1,
//       job_title: "Full Stack Engineer",
//       company: "Syntyce Solutions",
//       location: "Zuweihir, UAE",
//       salary: "$650 - $900",
//       experience: "0-1+ year",
//       employment_type: "Part Time"
//     },
//     {
//       id: 2,
//       job_title: "UI/UX designer",
//       company: "Zoetic Fashion",
//       location: "Cullera, Spain",
//       salary: "$400+",
//       experience: "0-2 year",
//       employment_type: "Freelancer"
//     },
//     {
//       id: 3,
//       job_title: "Project Manager",
//       company: "Meta4Systems",
//       location: "Limestone, US",
//       salary: "$210 - $300",
//       experience: "0-2+ year",
//       employment_type: "Internship"
//     },
//     {
//       id: 4,
//       job_title: "Assistant / Store Keeper",
//       company: "Moetic Fashion",
//       location: "Limestone, US",
//       salary: "$600 - $870",
//       experience: "0-3 year",
//       employment_type: "Full Time"
//     },
//     {
//       id: 5,
//       job_title: "Marketing Director",
//       company: "Meta4Systems",
//       location: "Vinninga, Sweden",
//       salary: "$210 - $300",
//       experience: "0-2 year",
//       employment_type: "Full Time"
//     },
//     {
//       id: 6,
//       job_title: "Marketing Director",
//       company: "Zoetic Fashion",
//       location: "Quesada, US",
//       salary: "$600 - $870",
//       experience: "0-5 year",
//       employment_type: "Freelancer"
//     }
//   ]
//   const columns = useMemo(
//     () => [
//       {
//         Header: 'Job Title',
//         accessor: 'job_title',
//         disableFilters: true,
//         filterable: false,
//       },
//       {
//         Header: 'Company',
//         accessor: 'company',
//         disableFilters: true,
//         filterable: false,
//       },
//       {
//         Header: 'Location',
//         accessor: 'location',
//         disableFilters: true,
//         filterable: false,
//       },
//       {
//         Header: 'Salary',
//         accessor: 'salary',
//         disableFilters: true,
//         filterable: false,
//       },
//       {
//         Header: 'Experience',
//         accessor: 'experience',
//         disableFilters: true,
//         filterable: false,
//       },
//       {
//         Header: 'Employment Type',
//         accessor: 'employment_type',
//         disableFilters: true,
//         filterable: false,
//       },
//     ],
//     []
//   );
//   return (
//     <React.Fragment >
//       <Col lg={12}>
//         <Card>
//           <CardHeader>
//             <Row className="g-4 align-items-center">
//               <Col className="col-sm-auto">
//                 <div>
//                   <h4 className="card-title mb-0 flex-grow-1">
//                     Recomended Jobs
//                   </h4>
//                 </div>
//               </Col>
//               <Col className="col-sm">
//                 <div className="d-flex justify-content-sm-end">
//                   <div className="search-box ms-2">
//                     <input
//                       type="text"
//                       className="form-control"
//                       id="searchResultList"
//                       placeholder="Search for jobs..."
//                     // onKeyUp={(e:any) => searchJob(e)}
//                     />
//                     <i className="ri-search-line search-icon"></i>
//                   </div>
//                 </div>
//               </Col>
//             </Row>
//           </CardHeader>
//           <CardBody>
//             <TableContainer
//               columns={(columns || [])}
//               data={(data || [])}
//               // isPagination={true}
//               // isGlobalFilter={false}
//               iscustomPageSize={false}
//               isBordered={false}
//               customPageSize={5}
//               // className="custom-header-css table align-middle table-nowrap"
//               tableClassName="table-centered align-middle table-nowrap mb-0"
//               theadClassName="text-muted table-light gridjs-thead" SearchPlaceholder={""}            />
//           </CardBody>
//         </Card>
//       </Col>
//     </React.Fragment >
//   );
// };
// export default RecomendedJobs;

import React, { useMemo } from "react";
import { Col, Card, CardBody, CardHeader, Row } from "reactstrap";
import TableContainer from "../../components/Common/TableContainerReactTable";
const RecomendedJobs = () => {
  const data = [
    {
      id: 1,
      job_title: "Full Stack Engineer",
      company: "Syntyce Solutions",
      location: "Zuweihir, UAE",
      salary: "$650 - $900",
      experience: "0-1+ year",
      employment_type: "Part Time"
    },
    {
      id: 2,
      job_title: "UI/UX designer",
      company: "Zoetic Fashion",
      location: "Cullera, Spain",
      salary: "$400+",
      experience: "0-2 year",
      employment_type: "Freelancer"
    },
    {
      id: 3,
      job_title: "Project Manager",
      company: "Meta4Systems",
      location: "Limestone, US",
      salary: "$210 - $300",
      experience: "0-2+ year",
      employment_type: "Internship"
    },
    {
      id: 4,
      job_title: "Assistant / Store Keeper",
      company: "Moetic Fashion",
      location: "Limestone, US",
      salary: "$600 - $870",
      experience: "0-3 year",
      employment_type: "Full Time"
    },
    {
      id: 5,
      job_title: "Marketing Director",
      company: "Meta4Systems",
      location: "Vinninga, Sweden",
      salary: "$210 - $300",
      experience: "0-2 year",
      employment_type: "Full Time"
    },
    {
      id: 6,
      job_title: "Marketing Director",
      company: "Zoetic Fashion",
      location: "Quesada, US",
      salary: "$600 - $870",
      experience: "0-5 year",
      employment_type: "Freelancer"
    }
  ]
  const columns = useMemo(
    () => [
      {
        header: 'Job Title',
        accessorKey: 'job_title',
        disableFilters: true,
        enableColumnFilter: false,
      },
      {
        header: 'Company',
        accessorKey: 'company',
        disableFilters: true,
        enableColumnFilter: false,
      },
      {
        header: 'Location',
        accessorKey: 'location',
        disableFilters: true,
        enableColumnFilter: false,
      },
      {
        header: 'Salary',
        accessorKey: 'salary',
        disableFilters: true,
        enableColumnFilter: false,
      },
      {
        header: 'Experience',
        accessorKey: 'experience',
        disableFilters: true,
        enableColumnFilter: false,
      },
      {
        header: 'Employment Type',
        accessorKey: 'employment_type',
        disableFilters: true,
        enableColumnFilter: false,
      },
    ],
    []
  );
  return (
    <React.Fragment >
      <Col lg={12}>
      <Card>
          <CardHeader>
            <Row className="g-4 align-items-center">
              <Col className="col-sm-auto">
                <div>
                  <h4 className="card-title mb-0 flex-grow-1">
                    Recomended Jobs
                  </h4>
                </div>
              </Col>
              <Col className="col-sm">
                <div className="d-flex justify-content-sm-end">
                  <div className="search-box ms-2">
                    <input
                      type="text"
                      className="form-control"
                      id="searchResultList"
                      placeholder="Search for jobs..."
                      // onKeyUp={(e) => searchJob(e)}
                    />
                    <i className="ri-search-line search-icon"></i>
                  </div>
                </div>
              </Col>
            </Row>
          </CardHeader>
          <CardBody>
          <TableContainer
              columns={(columns || [])}
              data={(data || [])}
              // isPagination={true}
              // iscustomPageSize={false}
              isBordered={false}
              customPageSize={5}
              // className="custom-header-css table align-middle table-nowrap"
              tableClass="table-centered align-middle table-nowrap mb-0"
              theadClass="text-muted table-light gridjs-thead"
    />
          </CardBody>
        </Card>
      </Col>
  </React.Fragment >
  );
};
export default RecomendedJobs;