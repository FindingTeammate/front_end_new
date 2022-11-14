import { useQuery } from "@tanstack/react-query";
import { useAuthContext } from "../../AuthProvider";
import styles from "./acceptedRequests.module.scss";
import { Alert, Title } from "@mantine/core";
import { IconUserCheck } from "@tabler/icons";

const getAcceptedRequests = async (accessToken) => {
  const response = await fetch("https://ftm.pythonanywhere.com/api/friends/", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return response.json();
};

const AcceptedRequests = () => {
  const [{ access: accessToken }] = useAuthContext();
  const { data, isLoading } = useQuery(["accepted-requests"], () =>
    getAcceptedRequests(accessToken)
  );
  if (isLoading) {
    return <p>Loading..</p>;
  }
  return (
    <div className={styles["accepted-requests-container"]}>
      <Title order={1}>Accepted Requests</Title>
      {data.map((request) => (
        <>
          <Alert
            key={request.id}
            icon={<IconUserCheck size={20} />}
            title="Accepted Request"
            color="grape"
            className={styles["accepted-request-item"]}
          >
            <p>
              <span>Name : </span> {`${request.first_name} ${request.last_name}`}
            </p>
            <p>
              <span>Email: </span> {request.email}
            </p>
          </Alert>
        </>
      ))}
    </div>
  );
};

export default AcceptedRequests;
