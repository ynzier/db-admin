import React, { useState, useEffect } from 'react';
import {
  Col,
  Row,
  Card,
  Form,
  Button,
  Modal,
  Alert,
} from '@themesberg/react-bootstrap';
import ProductService from '../services/product.service';

import AuthService from '../services/auth.service';

var getData = [];
var getDataAlt = [];
const ProductRegisterForm = () => {
  const initialRecordState = {
    prod_name: '',
    description: '',
  };

  const [errorMessage, setErrorMessage] = useState('');
  const [fileerrorMessage, setFileErrorMessage] = useState('');
  const [modalShow, setModalShow] = useState(false);
  const [typeData, setTypeData] = useState([]);
  const [brandData, setBrandData] = useState([]);
  const [itemCount, setItemCount] = useState(1);
  const [productPrice, setProductPrice] = useState(0);
  const [productType, setProductType] = useState('');
  const [productBrand, setProductBrand] = useState('');
  const [record, setRecord] = useState(initialRecordState);
  const [status, setStatus] = useState(0);
  const blockInvalidChar = e =>
    ['e', 'E', '+', '-'].includes(e.key) && e.preventDefault();

  const [base64TextString, setBase64TextString] = useState();
  const handleFileChange = (e: any) => {
    let file = e.target.files[0];
    if (file) {
      if (file.size <= 3 * 1024 * 1024) {
        const reader = new FileReader();
        reader.onload = _handleReaderLoaded;
        reader.readAsBinaryString(file);
        setFileErrorMessage('');
      } else {
        setFileErrorMessage('ไฟล์จะต้องมีขนาดไม่เกิน 3 MB');
        setBase64TextString();
      }
    }
  };
  const _handleReaderLoaded = (readerEvt: any) => {
    let binaryString = readerEvt.target.result;
    setBase64TextString(btoa(binaryString));
  };

  const handleInputChange = event => {
    const { name, value } = event.target;
    setRecord({ ...record, [name]: value });
  };

  useEffect(() => {
    document.title = 'เพิ่มสินค้า';
    let mounted = true;
    ProductService.getProductType()
      .then(res => {
        if (mounted) {
          getData = res.data;
          setTypeData(getData);
          setErrorMessage('');
        }
      })
      .catch(error => {
        const resMessage =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();
        setErrorMessage(resMessage);
      });
    ProductService.getBrand()
      .then(res => {
        if (mounted) {
          getDataAlt = res.data;
          setBrandData(getDataAlt);
          setErrorMessage('');
        }
      })
      .catch(error => {
        const resMessage =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();
        setErrorMessage(resMessage);
      });
    return () => (mounted = false);
  }, []);

  const form = document.forms[0];
  const MyVerticallyCenteredModal = props => {
    return (
      <Modal {...props}>
        <Modal.Header closeButton>
          <Modal.Title>ข้อมูลการรับประกัน</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>ชื่อสินค้า: {record.prod_name}</p>
          <p>ราคา: {productPrice}</p>
          <p>จำนวนสินค้า: {itemCount}</p>
          <p>ชนิดสินค้า: {productType}</p>
          <p>แบรนด์: {productBrand}</p>
          <img
            src={`data:image/jpeg;base64,${base64TextString}`}
            alt=""
            style={{
              border: '1px solid #ddd',
              'border-radius': '4px',
              padding: '5px',
              width: '150px',
            }}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={sendData}>
            Save Changes
          </Button>
          {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
        </Modal.Footer>
      </Modal>
    );
  };

  const handleSubmit = e => {
    e.preventDefault();
    setModalShow(true);
  };

  const sendData = () => {
    var data = {
      prod_name: record.prod_name,
      price: productPrice,
      prod_type: productType,
      stock: itemCount,
      image: base64TextString,
      description: record.description,
      brand_id: productBrand,
    };
    ProductService.add(data)
      .then(response => {
        setModalShow(false);
        setStatus(1);
        form.reset();
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

  return (
    <Card border="light" className="bg-white shadow-sm mb-4">
      <Card.Body>
        <Form onSubmit={handleSubmit}>
          <h5 className="mb-4">ข้อมูลสินค้า / Goods Info</h5>
          <Row>
            <Col md={6} className="mb-3">
              <Form.Group id="ItemNo">
                <Form.Label>ชื่อสินค้า</Form.Label>
                <Form.Control
                  required
                  type="text"
                  placeholder="ชื่อสินค้า"
                  name="prod_name"
                  onChange={handleInputChange}
                />
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col md={4} className="mb-3">
              <Form.Group id="modelID">
                <Form.Label>ราคา</Form.Label>
                <Form.Control
                  required
                  type="number"
                  defaultValue="1"
                  name="price"
                  step="0.01"
                  onKeyDown={blockInvalidChar}
                  onChange={e => setProductPrice(e.target.value)}
                />
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col md={4} className="mb-3">
              <Form.Group id="modelID">
                <Form.Label>จำนวนสินค้า</Form.Label>
                <Form.Control
                  required
                  type="number"
                  defaultValue="1"
                  name="itemCount"
                  onKeyDown={blockInvalidChar}
                  onChange={e => setItemCount(e.target.value)}
                />
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col md={4} className="mb-3">
              <Form.Group id="modelID">
                <Form.Label>ชนิดสินค้า</Form.Label>
                <Form.Select
                  required
                  onChange={e => setProductType(e.target.value)}>
                  <option>Select a Product type</option>
                  {typeData.map(option => (
                    <option key={option.prod_type} value={option.prod_type}>
                      {option.category}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={4} className="mb-3">
              <Form.Group id="modelID">
                <Form.Label>แบรนด์</Form.Label>
                <Form.Select
                  required
                  onChange={e => setProductBrand(e.target.value)}>
                  <option>Select a Brand</option>
                  {brandData.map(option => (
                    <option key={option.id} value={option.id}>
                      {option.name}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col sm={10} className="mb-3">
              <Form.Group id="address">
                <Form.Label>คำอธิบาย</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  placeholder="คำอธิบายเกี่ยวกับสินค้า"
                  style={{ resize: 'none' }}
                  name="description"
                  onChange={handleInputChange}
                />
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col md={4} className="mb-3">
              <Form.Group id="modelID">
                <Form.Label>รูปสินค้า</Form.Label>
                <Form.Control
                  type="file"
                  size="35"
                  accept="image/png, image/jpeg"
                  onChange={handleFileChange}
                />
              </Form.Group>
              {fileerrorMessage && (
                <Alert variant="danger">{fileerrorMessage}</Alert>
              )}
            </Col>
          </Row>
          <Row>
            <Col md={1}>
              <div>
                <Button
                  variant="primary"
                  type="submit"
                  style={{ height: 55, width: '100%' }}>
                  Add
                </Button>
              </div>
            </Col>
            <Col md={5}>
              {status === 1 ? (
                <Alert
                  variant="success"
                  onClose={() => setStatus(0)}
                  dismissible>
                  บันทึกข้อมูลเรียบร้อยแล้ว !
                </Alert>
              ) : (
                ''
              )}
            </Col>
          </Row>
        </Form>

        <MyVerticallyCenteredModal
          show={modalShow}
          onHide={() => {
            setModalShow(false);
          }}
        />
      </Card.Body>
    </Card>
  );
};

const AdminRegisterForm = () => {
  const initialRecordState = {
    username: '',
    password: '',
    firstName: '',
    lastName: '',
  };

  const [errorMessage, setErrorMessage] = useState('');
  const [modalShow, setModalShow] = useState(false);
  const [roleData, setRoleData] = useState([]);

  const [roleID, setRoleID] = useState('');
  const [record, setRecord] = useState(initialRecordState);
  const [status, setStatus] = useState(0);
  const handleInputChange = event => {
    const { name, value } = event.target;
    setRecord({ ...record, [name]: value });
  };

  useEffect(() => {
    document.title = 'Admin Dashboard / ผู้ดูแลระบบ';
    let mounted = true;
    AuthService.getAllRole()
      .then(res => {
        if (mounted) {
          getData = res.data;
          setRoleData(getData);
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

  const form = document.forms[0];
  const MyVerticallyCenteredModal = props => {
    return (
      <Modal {...props}>
        <Modal.Header closeButton>
          <Modal.Title>ข้อมูลผู้ใช้งาน</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            ชื่อ - นามสกุล: {record.firstName} {record.lastName}
          </p>
          <p>ชื่อผู้ใช้งาน: {record.username}</p>
        </Modal.Body>
        <Modal.Footer>
          {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
          <Button variant="primary" onClick={sendData}>
            ยืนยัน
          </Button>
        </Modal.Footer>
      </Modal>
    );
  };

  const handleSubmit = e => {
    e.preventDefault();
    console.log(roleID);
    setModalShow(true);
  };

  const sendData = () => {
    var data = {
      firstName: record.firstName,
      lastName: record.lastName,
      username: record.username,
      role_id: roleID,
      password: record.password,
    };
    AuthService.register(data)
      .then(response => {
        setModalShow(false);
        setStatus(1);
        form.reset();
      })
      .catch(error => {
        const resMessage =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();
        setErrorMessage(resMessage);
      });
  };

  return (
    <Card border="light" className="bg-white shadow-sm mb-4">
      <Card.Body>
        <Form onSubmit={handleSubmit}>
          <h5 className="my-4">ข้อมูลผู้ใช้งาน / User Info</h5>
          <Row>
            <Col md={6} className="mb-3">
              <Form.Group id="address">
                <Form.Label>E-mail</Form.Label>
                <Form.Control
                  required
                  type="email"
                  placeholder="อีเมลล์"
                  name="username"
                  onChange={handleInputChange}
                />
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col md={4} className="mb-3">
              <Form.Group id="password">
                <Form.Label>รหัสผ่าน</Form.Label>
                <Form.Control
                  required
                  type="password"
                  placeholder="รหัสผ่าน"
                  name="password"
                  onChange={handleInputChange}
                />
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col md={4} className="mb-3">
              <Form.Group id="address">
                <Form.Label>ชื่อ</Form.Label>
                <Form.Control
                  required
                  type="text"
                  placeholder="ชื่อ"
                  name="firstName"
                  onChange={handleInputChange}
                />
              </Form.Group>
            </Col>
            <Col md={4} className="mb-3">
              <Form.Group id="address">
                <Form.Label>นามสกุล</Form.Label>
                <Form.Control
                  required
                  type="text"
                  placeholder="นามสกุล"
                  name="lastName"
                  onChange={handleInputChange}
                />
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col md={4} className="mb-3">
              <Form.Group id="role_id">
                <Form.Label>ตำแหน่ง</Form.Label>
                <Form.Select required onChange={e => setRoleID(e.target.value)}>
                  <option>เลือกตำแหน่ง</option>
                  {roleData.map(option => (
                    <option key={option.role_id} value={option.role_id}>
                      {option.roleName}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={2}>
              <div>
                <Button
                  variant="primary"
                  type="submit"
                  style={{ height: 55, width: '100%' }}>
                  Add
                </Button>
              </div>
            </Col>
            <Col md={5}>
              {status === 1 ? (
                <Alert
                  variant="success"
                  onClose={() => setStatus(0)}
                  dismissible>
                  บันทึกข้อมูลเรียบร้อยแล้ว !
                </Alert>
              ) : (
                ''
              )}
            </Col>
          </Row>
        </Form>

        <MyVerticallyCenteredModal
          show={modalShow}
          onHide={() => {
            setModalShow(false);
            setErrorMessage('');
          }}
        />
      </Card.Body>
    </Card>
  );
};

export { AdminRegisterForm, ProductRegisterForm };
