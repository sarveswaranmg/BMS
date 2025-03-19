import React, { useEffect, useState } from "react";
import { getAllTheatresForAdmin, updateTheatre } from "../../api/theatre";
import { ShowLoading, HideLoading } from "../../redux/loaderSlice";
import { useDispatch } from "react-redux";
import { Table, message, Button } from "antd";

function TheatreTable() {
  const [theatres, setTheatres] = useState([]);
  const dispatch = useDispatch();

  const getData = async () => {
    try {
      dispatch(ShowLoading());
      const response = await getAllTheatresForAdmin();
      if (response.success) {
        const allTheatres = response.data;
        setTheatres(
          allTheatres.map(function (item) {
            return { ...item, key: `theatre ${item._id}` };
          })
        );
      } else {
        message.error(response.message);
      }
      dispatch(HideLoading());
    } catch (err) {
      console.log(err);
      message.error(err);
    }
  };

  useEffect(() => {
    getData();
  }, []);
  const handleStatusChange = async (theatre) => {
    try {
      const values = {
        ...theatre,
        theatreId: theatre._id,
        isActive: !theatre.isActive,
      };
      console.log("changes for handling be4 updatefunction", values);
      const response = await updateTheatre(values);
      if (response.success) {
        message.success(response.message);
        getData();
      } else {
        message.error(response.message);
      }
      dispatch(HideLoading());
    } catch (err) {
      console.log(err);
      message.error(err.message);
    }
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Address",
      dataIndex: "address",
      key: "address",
    },
    {
      title: "Owner",
      dataIndex: "owner",
      key: "owner",
      render: (text, data) => {
        return data.owner && data.owner.name;
      },
    },
    {
      title: "Phone Number",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (status, data) => {
        console.log("status", data.isActive);

        if (data.isActive) {
          return "Approved";
        } else {
          return "Pending/Blocked";
        }
      },
    },
    {
      title: "Actions",
      render: (text, data) => {
        return (
          <div>
            <Button
              type="primary"
              onClick={() => {
                console.log("button", data);
                handleStatusChange(data);
              }}
            >
              {data.isActive ? "Block" : "Approve"}
            </Button>
          </div>
        );
      },
    },
  ];
  return (
    <div>
      {theatres && theatres.length > 0 && (
        <Table dataSource={theatres} columns={columns}></Table>
      )}
    </div>
  );
}

export default TheatreTable;
