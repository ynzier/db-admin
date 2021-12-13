/* eslint-disable import/no-anonymous-default-export */

import React, { useState } from 'react';
import SimpleBar from 'simplebar-react';
import { useLocation } from 'react-router-dom';
import { CSSTransition } from 'react-transition-group';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPlus,
  faSignOutAlt,
  faTasks,
  faCogs,
  faTimes,
  faInbox,
  faUserPlus,
  faUserCircle,
} from '@fortawesome/free-solid-svg-icons';
import {
  Nav,
  Badge,
  Image,
  Button,
  Dropdown,
  Navbar,
} from '@themesberg/react-bootstrap';
import { Link } from 'react-router-dom';

import { Routes } from '../routes';
import ReactHero from '../assets/img/technologies/react-hero-logo.svg';
import ProfilePicture from '../assets/img/team/icon.png';

import AuthService from '../services/auth.service';

export default (props = {}) => {
  const location = useLocation();
  const { pathname } = location;
  const [show, setShow] = useState(false);
  const showClass = show ? 'show' : '';
  const logOut = () => {
    AuthService.logout();
  };
  const onCollapse = () => setShow(!show);
  const NavItem = props => {
    const {
      title,
      link,
      external,
      target,
      icon,
      image,
      badgeText,
      badgeBg = 'secondary',
      badgeColor = 'primary',
    } = props;

    const classNames = badgeText
      ? 'd-flex justify-content-start align-items-center justify-content-between'
      : '';
    const navItemClassName = link === pathname ? 'active' : '';
    const linkProps = external ? { href: link } : { as: Link, to: link };

    return (
      <Nav.Item className={navItemClassName} onClick={() => setShow(false)}>
        <Nav.Link {...linkProps} target={target} className={classNames}>
          <span>
            {icon ? (
              <span className="sidebar-icon">
                <FontAwesomeIcon icon={icon} />{' '}
              </span>
            ) : null}
            {image ? (
              <Image
                src={image}
                width={20}
                height={20}
                className="sidebar-icon svg-icon"
              />
            ) : null}

            <span className="sidebar-text">{title}</span>
          </span>
          {badgeText ? (
            <Badge
              pill
              bg={badgeBg}
              text={badgeColor}
              className="badge-md notification-count ms-2">
              {badgeText}
            </Badge>
          ) : null}
        </Nav.Link>
      </Nav.Item>
    );
  };

  return (
    <>
      <Navbar
        expand={false}
        collapseOnSelect
        variant="dark"
        className="navbar-theme-primary px-4 d-md-none">
        <Navbar.Brand
          className="me-lg-5"
          as={Link}
          to={Routes.ProductList.path}>
          <Image src={ReactHero} className="navbar-brand-light" />
        </Navbar.Brand>
        <Navbar.Toggle
          as={Button}
          aria-controls="main-navbar"
          onClick={onCollapse}>
          <span className="navbar-toggler-icon" />
        </Navbar.Toggle>
      </Navbar>
      <CSSTransition timeout={300} in={show} classNames="sidebar-transition">
        <SimpleBar
          className={`collapse ${showClass} sidebar d-md-block bg-primary text-white`}>
          <div className="sidebar-inner px-4 pt-3">
            <div className="user-card d-flex d-md-none align-items-center justify-content-between justify-content-md-center pb-4">
              <div className="d-flex align-items-center">
                <div className="user-avatar lg-avatar me-4">
                  <Image
                    src={ProfilePicture}
                    className="card-img-top rounded-circle border-white"
                  />
                </div>
                <div className="d-block">
                  <h6>Hello !</h6>
                  <Button
                    as={Link}
                    variant="secondary"
                    size="xs"
                    to={Routes.Signin.path}
                    className="text-dark">
                    <FontAwesomeIcon icon={faSignOutAlt} className="me-2" />{' '}
                    Sign Out
                  </Button>
                </div>
              </div>
              <Nav.Link
                className="collapse-close d-md-none"
                onClick={onCollapse}>
                <FontAwesomeIcon icon={faTimes} />
              </Nav.Link>
            </div>
            <Nav className="flex-column pt-3 pt-md-0">
              <NavItem
                title="รายการสินค้า"
                icon={faTasks}
                link={Routes.ProductList.path}
              />
              <NavItem
                title="เพิ่มสินค้า"
                icon={faPlus}
                link={Routes.AddItem.path}
              />
              <NavItem
                title="รายชื่อผู้ดูแล"
                icon={faUserCircle}
                link={Routes.AllAdmin.path}
              />
              <NavItem
                title="เพิ่มผู้ดูแล"
                icon={faUserPlus}
                link={Routes.AddAdmin.path}
              />
              <NavItem
                title="รายชื่อผู้ใช้งาน"
                icon={faUserCircle}
                link={Routes.AllCustomer.path}
              />
              <NavItem
                title="รายการสั่งซื้อ"
                icon={faInbox}
                link={Routes.TransactionList.path}
              />
              <NavItem
                title="ตั้งค่าอื่นๆ"
                icon={faCogs}
                link={Routes.Setting.path}
              />
              <Dropdown.Divider className="my-3 border-indigo" />
              <Button
                variant="light"
                size="xm"
                className="text-dark"
                onClick={() => {
                  logOut();
                  window.location = '/';
                }}>
                <FontAwesomeIcon
                  icon={faSignOutAlt}
                  className="me-1"
                  color="red"
                />
                Sign Out
              </Button>
            </Nav>
          </div>
        </SimpleBar>
      </CSSTransition>
    </>
  );
};
