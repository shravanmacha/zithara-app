import { useEffect, useState } from "react";
import { Container, Navbar, Spinner, Table } from "react-bootstrap";

function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [customersList, setCustomersList] = useState([]);

  useEffect(() => {
    getCustomers();
  }, []);

  const getCustomers = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("http://localhost:4000/api/getCustomers");
      const data = await response.json();
      if (data.status === "success") {
        setCustomersList(data.data);
      }
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
    }
  };

  return (
    <Container fluid className="px-0">
      <Navbar className="bg-light mb-4">
        <h2 className="mx-auto">Zithara Customers</h2>
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
        <Table>
          <thead>
            <tr>
              <th>S.No.</th>
              <th>Customer Name</th>
              <th>Age</th>
              <th>Phone Number</th>
              <th>Location</th>
              <th>Date</th>
              <th>Time</th>
            </tr>
          </thead>
          <tbody>
            {customersList.map((item) => {
              return (
                <tr key={item.sno}>
                  <td>{item.sno}</td>
                  <td>{item.name}</td>
                  <td>{item.age}</td>
                  <td>{item.phone_number}</td>
                  <td>{item.location}</td>
                  <td>{item.created_at}</td>
                  <td>{item.created_at}</td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      )}
    </Container>
  );
}

export default App;
