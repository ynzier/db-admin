import React, { useState, useEffect } from 'react';
import ProductService from '../services/product.service';
import { Table } from 'antd';
import 'antd/dist/antd.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { Form, InputGroup, Button } from '@themesberg/react-bootstrap';

export const SettingForm = props => {
  const [brandData, setBrandData] = useState(props.data);
  const [input, setInput] = useState();
  useEffect(() => {
    let mounted = true;
    ProductService.getBrand()
      .then(res => {
        if (mounted) {
          setBrandData(res.data);
        }
      })
      .catch(error => {
        const resMessage =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();
        alert(resMessage);
      });
    return () => (mounted = false);
  }, []);

  const refreshList = () => {
    ProductService.getBrand()
      .then(res => {
        setBrandData(res.data);
      })
      .catch(error => {
        const resMessage =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();
        alert(resMessage);
      });
  };
  const sendData = () => {
    var data = {
      name: input,
    };
    ProductService.addBrand(data)
      .then(response => {
        refreshList();
      })
      .catch(error => {
        const resMessage =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();
        alert(resMessage);
      });
  };
  const deleteRecord = id => {
    ProductService.remove(id)
      .then(response => {
        refreshList();
      })
      .catch(error => {
        const resMessage =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();
        alert(resMessage);
      });
  };

  const header = [
    {
      title: 'แบรนด์',
      dataIndex: 'name',
      key: 'name',
      align: 'center',
    },
    {
      title: 'Action',
      key: 'key',
      dataIndex: 'key',
      render: (text, record) => {
        const id = record.id;

        return (
          <div>
            <span
              onClick={() => {
                deleteRecord(id);
              }}>
              <i className="fas fa-trash action"></i>
            </span>
          </div>
        );
      },
    },
  ];
  return (
    <>
      <div className="border-bottom border-light d-flex justify-content-between">
        <h5 className="mb-0">เพิ่ม / ลบ แบรนด์</h5>
        <InputGroup className="mb-md-0" style={{ width: '30%' }}>
          <InputGroup.Text>
            <FontAwesomeIcon icon={faPlus} />
          </InputGroup.Text>
          <Form.Control
            type="text"
            placeholder="ชื่อแบรนด์"
            onChange={e => setInput(e.target.value)}
          />
          <Button onClick={sendData}>เพิ่ม</Button>
        </InputGroup>
      </div>
      <Table
        dataSource={brandData ? brandData : null}
        columns={header}
        rowkey="id"
      />
    </>
  );
};
