import { useEffect, useState } from "react";
import {
  Button,
  Col,
  Form,
  Pagination,
  Row,
  Container,
  Navbar,
  Spinner,
  Table,
} from "react-bootstrap";
import moment from "moment";
import { FaArrowUp, FaArrowDown } from "react-icons/fa";

function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [customersList, setCustomersList] = useState([]);
  const [tempCustomersList, setTempCustomersList] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [isFiltered, setIsFiltered] = useState(false);
  const [filteredList, setFilteredList] = useState([]);
  const [sortedByDate, setSortedByDate] = useState(false);
  let pageItems = [];

  useEffect(() => {
    fetchCustomersData();
  }, []);

  const fetchCustomersData = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("http://localhost:4000/api/getCustomers");
      const data = await response.json();
      setIsLoading(false);
      if (data.status === "success") {
        setTempCustomersList(data.data);
        setTotalPages(Math.ceil(data.data.length / 20));
        setCustomersList(data.data.slice(0, 20));
        setCurrentPage(1);
      } else {
        setCustomersList([]);
      }
      console.log(data);
    } catch (error) {
      setIsLoading(false);
      console.error(error);
    }
  };
  const searchTapped = (event) => {
    event.preventDefault();
    const target = event.target;
    const searchStr = target.search.value;
    //target.search.value = "";
    if (searchStr.length > 0) {
      const temp = tempCustomersList;
      const result = temp.filter(
        (item) =>
          item.name
            .toString()
            .toLowerCase()
            .includes(searchStr.toLowerCase()) ||
          item.location
            .toString()
            .toLowerCase()
            .includes(searchStr.toLowerCase())
      );
      setFilteredList(result);
      setIsFiltered(true);
      setTotalPages(Math.ceil(result.length / 20));
      setCurrentPage(1);
      setCustomersList(result.slice(0, 20));
    } else {
      setFilteredList([]);
      setIsFiltered(false);
      setTotalPages(Math.ceil(tempCustomersList.length / 20));
      setCurrentPage(1);
      setCustomersList(tempCustomersList.slice(0, 20));
    }
  };
  for (let number = 1; number <= totalPages; number++) {
    pageItems.push(
      <Pagination.Item
        key={number}
        active={number === currentPage}
        onClick={() => {
          setCurrentPage(number);
          const startIndex = (number - 1) * 20;
          const endIndex = number * 20;
          if (isFiltered) {
            setCustomersList(filteredList.slice(startIndex, endIndex));
          } else {
            setCustomersList(tempCustomersList.slice(startIndex, endIndex));
          }
        }}
      >
        {number}
      </Pagination.Item>
    );
  }
  const sortByDate = () => {
    const temp = tempCustomersList;
    const result = temp.sort((a, b) => {
      let date1 = moment(a.created_at);
      let date2 = moment(b.created_at);
      if (sortedByDate) {
        return Number(date1) - Number(date2);
      } else {
        return Number(date2) - Number(date1);
      }
    });
    setSortedByDate(!sortedByDate);
    setFilteredList(result);
    setIsFiltered(true);
    setTotalPages(Math.ceil(result.length / 20));
    setCurrentPage(1);
    setCustomersList(result.slice(0, 20));
  };

  return (
    <Container fluid>
      <Navbar className="bg-light mb-4">
        <h2 className="mx-auto text-center p-2">Zithara Customers App</h2>
        <Form onSubmit={searchTapped}>
          <Row>
            <Col xs="auto">
              <Form.Control
                type="text"
                placeholder="Search by name or location"
                className=" mr-sm-2"
                id="search"
                name="search"
              />
            </Col>
            <Col xs="auto">
              <Button type="submit">Submit</Button>
            </Col>
          </Row>
        </Form>
      </Navbar>

      {isLoading ? (
        <div className="text-center">
          <Spinner />
        </div>
      ) : customersList.length === 0 ? (
        <div className="text-center">
          <h4>No Customers Found</h4>
        </div>
      ) : (
        <Table responsive="sm">
          <thead>
            <tr>
              <th>S.No.</th>
              <th>Customer Name</th>
              <th>Age</th>
              <th>Phone Number</th>
              <th>Location</th>
              <th>
                <button
                  className="border-0 bg-body fw-bold"
                  onClick={sortByDate}
                >
                  Date{" "}
                  {sortedByDate ? (
                    <FaArrowDown size={"12"} />
                  ) : (
                    <FaArrowUp size={"12"} />
                  )}
                </button>
              </th>
              <th>Time</th>
            </tr>
          </thead>

          <tbody>
            {customersList.map((item) => {
              let date = moment(item.created_at).format("YYYY-MM-DD");
              let time = moment(item.created_at).format("HH:mm:ss");
              return (
                <tr key={item.sno}>
                  <td>{item.sno}</td>
                  <td>{item.name}</td>
                  <td>{item.age}</td>
                  <td>{item.phone_number}</td>
                  <td>{item.location}</td>
                  <td>{date}</td>
                  <td>{time}</td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      )}
      {totalPages > 1 && (
        <div className="mt-4 mb-5 d-flex align-items-center justify-content-center">
          <Pagination>{pageItems}</Pagination>
        </div>
      )}
    </Container>
  );
}

export default App;
