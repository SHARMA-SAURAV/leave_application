import api from '../services/api';
import React, { useEffect, useState, useMemo } from 'react';
import {
    Table, Card, Badge, Spinner, Row, Col, Form, InputGroup, Alert, Button
} from 'react-bootstrap';
import { FaSearch, FaSync } from 'react-icons/fa';
import { syncLeavesData } from '../services/analyticsApi';

export default function HRLeaveData() {
    const [leaveData, setLeaveData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [message, setMessage] = useState('');
    const [syncLoading, setSyncLoading] = useState(false);
    //Pagination states
    const [currentPage, setCurrentPage] = useState(1);
    const ROWS_PER_PAGE = 10;
    const totalPages = Math.ceil(filteredData.length / ROWS_PER_PAGE);

    //Paginated data
    const paginatedData = filteredData.slice(
        (currentPage - 1) * ROWS_PER_PAGE,
        currentPage * ROWS_PER_PAGE
    );

    //Pagination handlers
    const handleShowMore = () => {
        setCurrentPage(prev => Math.min(prev + 1, totalPages));
    };

    const handleShowLess = () => {
        setCurrentPage(prev => Math.max(prev - 1, 1));
    };


    const syncLeaveData = async (force = false) => {
        try {
            setSyncLoading(true);
            setMessage('');
            setError(null);

            const res = await syncLeavesData();

            // Refresh data after sync
            const freshData = await api.get("/leavedata/all");
            setLeaveData(freshData.data);
            setMessage(`Leave data synced successfully for ${new Date().getFullYear()}`);

        } catch (err) {
            console.error("Sync failed:", err);
            setError(" Sync failed - Check backend logs");
        } finally {
            setSyncLoading(false);
        }
    };

    useEffect(() => {
        const fetchLeaveData = async () => {
            try {
                setLoading(true);
                const res = await api.get("/leavedata/all");
                setLeaveData(res.data);
                setError(null);
            } catch (err) {
                console.error("Failed to fetch leave data", err);
                setError("Failed to load leave data");
            } finally {
                setLoading(false);
            }
        };

        fetchLeaveData();
    }, []);

    // ✅ Search filter
    useEffect(() => {
        const filtered = leaveData.filter(emp =>
            emp.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (emp.user?.name || '').toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredData(filtered);
    }, [searchTerm, leaveData]);

    // ✅ Department-wise stats + Totals
    const stats = useMemo(() => {
        if (!leaveData.length) return {};

        const deptStats = leaveData.reduce((acc, emp) => {
            const dept = emp.user?.department || 'Unknown';
            if (!acc[dept]) {
                acc[dept] = { casual: 0, privilege: 0, total: 0, count: 0 };
            }
            acc[dept].casual += parseFloat(emp.casualLeave || 0);
            acc[dept].privilege += parseFloat(emp.privilegeLeave || 0);
            acc[dept].total += parseFloat(emp.casualLeave || 0) + parseFloat(emp.privilegeLeave || 0);
            acc[dept].count += 1;
            return acc;
        }, {});

        const totalCasual = leaveData.reduce((sum, emp) => sum + parseFloat(emp.casualLeave || 0), 0);
        const totalPrivilege = leaveData.reduce((sum, emp) => sum + parseFloat(emp.privilegeLeave || 0), 0);
        const grandTotal = totalCasual + totalPrivilege;

        return {
            totalEmployees: leaveData.length,
            totalCasual: totalCasual.toFixed(1),
            totalPrivilege: totalPrivilege.toFixed(1),
            grandTotal: grandTotal.toFixed(1),
            topDept: Object.entries(deptStats)
                .sort(([, a], [, b]) => b.total - a.total)[0]?.[0] || 'None',
            deptStats
        };
    }, [leaveData]);

    if (loading) return (
        <div className="d-flex justify-content-center p-5">
            <Spinner animation="border" />
        </div>
    );

    return (
        <div className="p-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h1>HR Leave Dashboard</h1>
                {/* FIXED Sync Button */}
                <Button
                    variant="outline-primary"
                    onClick={() => syncLeaveData(true)}
                    disabled={syncLoading}
                    className="d-flex align-items-center gap-2"
                >
                    <FaSync className={syncLoading ? 'rotate-anim' : ''} />
                    {syncLoading ? 'Syncing...' : 'Sync Leave Data'}
                </Button>
            </div>

            {/* Sync Message */}
            {message && (
                <Alert variant="success" onClose={() => setMessage('')} dismissible className="mb-4">
                    {message}
                </Alert>
            )}

            {error && (
                <Alert variant="danger" onClose={() => setError(null)} dismissible className="mb-4">
                    {error}
                </Alert>
            )}



            {/* Enhanced Stats Cards */}
            <Row className="mb-4 g-3">
                <Col md={3}>
                    <Card className="text-center bg-primary text-white">
                        <Card.Body>
                            <Card.Title>{stats.totalEmployees}</Card.Title>
                            <Card.Text>Total Employees</Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={3}>
                    <Card className="text-center bg-success text-white">
                        <Card.Body>
                            <Card.Title>{stats.totalCasual}</Card.Title>
                            <Card.Text>Total Casual Leave</Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={3}>
                    <Card className="text-center bg-info text-white">
                        <Card.Body>
                            <Card.Title>{stats.totalPrivilege}</Card.Title>
                            <Card.Text>Total Privilege Leave</Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={3}>
                    <Card className="text-center bg-warning text-white">
                        <Card.Body>
                            <Card.Title>{stats.grandTotal}</Card.Title>
                            <Card.Text>Total Leave Days</Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/*Department-wise Stats */}
            <Card className="mb-4">
                <Card.Header>
                    <h5>Department-wise Leave Summary <Badge bg="secondary">{Object.keys(stats.deptStats).length} Depts</Badge></h5>
                </Card.Header>
                <Card.Body>
                    <div className="table-responsive">
                        <Table striped bordered hover className="table-sm">
                            <thead className="table-dark">
                                <tr>
                                    <th>Department</th>
                                    <th>Employees</th>
                                    <th>Casual Leave</th>
                                    <th>Privilege Leave</th>
                                    <th>Total Leave</th>
                                    <th>Avg/Employee</th>
                                </tr>
                            </thead>
                            <tbody>
                                {Object.entries(stats.deptStats)
                                    .sort(([, a], [, b]) => b.total - a.total)
                                    .map(([dept, data]) => (
                                        <tr key={dept}>
                                            <td><strong>{dept}</strong></td>
                                            <td>{data.count}</td>
                                            <td>{data.casual.toFixed(1)}</td>
                                            <td>{data.privilege.toFixed(1)}</td>
                                            <td><Badge bg="primary">{data.total.toFixed(1)}</Badge></td>
                                            <td>{(data.total / data.count).toFixed(1)}</td>
                                        </tr>
                                    ))}
                            </tbody>
                        </Table>
                    </div>
                </Card.Body>
            </Card>
            {/*  Search Bar */}
            <Card className="mb-4">
                <Card.Body>
                    <InputGroup>
                        <InputGroup.Text><FaSearch /></InputGroup.Text>
                        <Form.Control
                            type="text"
                            placeholder="Search by Employee ID or Name..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <Form.Text className="text-muted">
                            Showing {filteredData.length} of {leaveData.length} employees
                        </Form.Text>
                    </InputGroup>
                </Card.Body>
            </Card>
            {/* Employee Table */}
            {/* <Card className="mb-4">
                <Card.Header className="d-flex justify-content-between">
                    <h5>Employee Leave Balances</h5>
                    <Badge bg="primary">{filteredData.length} Employees</Badge>
                </Card.Header>
                <Card.Body>
                    <div style={{ maxHeight: '500px', overflow: 'auto' }}>
                        <Table hover responsive className="table-sm">
                            <thead className="table-dark sticky-top">
                                <tr>
                                    <th>ID</th>
                                    <th>Name</th>
                                    <th>Dept</th>
                                    <th>Casual Leave(CL)</th>
                                    <th>Privilege Leave(PL)</th>
                                    <th>Restricted Holiday(RH)</th>
                                    <th>Earned Leave(EL)</th>
                                    <th>Half Paid Leave(HPL)</th>
                                    <th>Sick Leave(SL)</th>
                                    <th>Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredData.map((emp) => {
                                    const total = parseFloat(emp.casualLeave || 0) +
                                                parseFloat(emp.privilegeLeave || 0) +
                                                parseFloat(emp.restrictedHoliday || 0) +
                                                parseFloat(emp.earnedLeave || 0) +
                                                parseFloat(emp.halfPaidLeave || 0) +
                                                parseFloat(emp.sickLeave || 0);

                                    return (
                                        <tr key={emp.id}>
                                            <td><strong>{emp.employeeId}</strong></td>
                                            <td>{emp.user?.name || 'N/A'}</td>
                                            <td>{emp.user?.department || 'N/A'}</td>
                                            <td><Badge bg={parseFloat(emp.casualLeave || 0) > 0 ? 'success' : 'secondary'}>
                                                {emp.casualLeave || '0.0'}
                                            </Badge></td>
                                            <td><Badge bg={parseFloat(emp.privilegeLeave || 0) > 0 ? 'success' : 'secondary'}>
                                                {emp.privilegeLeave || '0.0'}</Badge></td>
                                            <td>{emp.restrictedHoliday || '0.0'}</td>
                                            <td>{emp.earnedLeave || '0.0'}</td>
                                            <td>{emp.halfPaidLeave || '0.0'}</td>
                                            <td>{emp.sickLeave || '0.0'}</td>
                                            <td>
                                                <Badge bg={total > 5 ? 'success' : total < 2 ? 'danger' : 'warning'}>
                                                    {total.toFixed(1)}
                                                </Badge>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </Table>
                    </div>
                </Card.Body>
            </Card> */}


            {/* ✅ Paginated Employee Table */}
            <Card className="mb-4">
                <Card.Header className="d-flex justify-content-between align-items-center">
                    <h5>Employee Leave Balances</h5>
                    <div>
                        <Badge bg="primary">{filteredData.length} Employees</Badge>
                        <span className="ms-2 text-muted small">
                            Page {currentPage} of {totalPages}
                        </span>
                    </div>
                </Card.Header>
                <Card.Body>
                    <div style={{ maxHeight: '500px', overflow: 'auto' }}>
                        <Table hover responsive className="table-sm">
                            <thead className="table-dark sticky-top">
                                <tr>
                                    <th>ID</th>
                                    <th>Name</th>
                                    <th>Dept</th>
                                    <th>Casual Leave(CL)</th>
                                    <th>Privilege Leave(PL)</th>
                                    <th>Restricted Holiday(RH)</th>
                                    <th>Earned Leave(EL)</th>
                                    <th>Half Paid Leave(HPL)</th>
                                    <th>Sick Leave(SL)</th>
                                    <th>Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                {paginatedData.map((emp) => {
                                    const total = parseFloat(emp.casualLeave || 0) +
                                        parseFloat(emp.privilegeLeave || 0) +
                                        parseFloat(emp.restrictedHoliday || 0) +
                                        parseFloat(emp.earnedLeave || 0) +
                                        parseFloat(emp.halfPaidLeave || 0) +
                                        parseFloat(emp.sickLeave || 0);

                                    return (
                                        <tr key={emp.id}>
                                            <td><strong>{emp.employeeId}</strong></td>
                                            <td>{emp.user?.name || 'N/A'}</td>
                                            <td>{emp.user?.department || 'N/A'}</td>
                                            <td>
                                                <Badge bg={parseFloat(emp.casualLeave || 0) > 0 ? 'success' : 'secondary'}>
                                                    {emp.casualLeave || '0.0'}
                                                </Badge>
                                            </td>
                                            <td>
                                                <Badge bg={parseFloat(emp.privilegeLeave || 0) > 0 ? 'success' : 'secondary'}>
                                                    {emp.privilegeLeave || '0.0'}
                                                </Badge>
                                            </td>
                                            <td>{emp.restrictedHoliday || '0.0'}</td>
                                            <td>{emp.earnedLeave || '0.0'}</td>
                                            <td>{emp.halfPaidLeave || '0.0'}</td>
                                            <td>{emp.sickLeave || '0.0'}</td>
                                            <td>
                                                <Badge bg={total > 5 ? 'success' : total < 2 ? 'danger' : 'warning'}>
                                                    {total.toFixed(1)}
                                                </Badge>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </Table>
                    </div>

                    {/* ✅ Pagination Controls */}
                    {filteredData.length > 10 && (
                        <div className="d-flex justify-content-between align-items-center mt-3 p-3 border-top">
                            <div className="text-muted small">
                                Showing {paginatedData.length} of {filteredData.length} employees
                            </div>
                            <div className="d-flex gap-2">
                                <Button
                                    variant="outline-primary"
                                    size="sm"
                                    onClick={handleShowLess}
                                    disabled={currentPage === 1}
                                >
                                    Show Less (10)
                                </Button>
                                <Button
                                    variant="primary"
                                    size="sm"
                                    onClick={handleShowMore}
                                    disabled={currentPage === totalPages || filteredData.length <= 10}
                                >
                                    Show More (+10)
                                </Button>
                            </div>
                        </div>
                    )}
                </Card.Body>
            </Card>

        </div>
    );
}
