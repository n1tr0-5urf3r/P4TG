import React, {useEffect, useState} from 'react'
import {Col, Row, Table} from "react-bootstrap";
import {Statistics, Stream} from "../common/Interfaces";
import {formatBits} from "./SendReceiveMonitor";
import ports from "../sites/Ports";
import {stat} from "fs";

const StreamView = ({stats, port_mapping, stream_id, frame_size}: { stats: Statistics, port_mapping: { [name: number]: number }, stream_id: number, frame_size: number})  => {
    const [tx_rate_l2, set_tx_rate_l2] = useState(0)
    const [rx_rate_l2, set_rx_rate_l2] = useState(0)

    useEffect(() => {
        let tx_rate_l2 = 0
        let rx_rate_l2 = 0


        Object.keys(port_mapping).map(p => {
            if(Object.keys(stats.app_tx_l2).includes(p)) {
                tx_rate_l2 += stats.app_tx_l2[p][stream_id.toString()]
            }
        })

        Object.values(port_mapping).map(String).map(p => {
            if(Object.keys(stats.app_rx_l2).includes(p)) {
                rx_rate_l2 += stats.app_rx_l2[p][stream_id.toString()]
            }
        })


        set_tx_rate_l2(tx_rate_l2)
        set_rx_rate_l2(rx_rate_l2)
    }, [stats])
    return <>
        <Row className={"mb-3"}>
            <Col>
                <Table striped bordered hover size="sm" className={"mt-3 mb-3"}>
                    <thead className={"table-dark"}>
                    <tr>
                        <th className={"col-2"}>TX L1</th>
                        <th className={"col-2"}>RX L1</th>
                        <th className={"col-2"}>TX L2</th>
                        <th className={"col-2"}>RX L2</th>
                        <th className={"col-2"}>Frame Size</th>
                        <th className={"col-2"}>Loss rate</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                        <td>{formatBits(tx_rate_l2 * (frame_size + 20)/frame_size)}</td>
                        <td>{formatBits(rx_rate_l2 * (frame_size + 20)/frame_size)}</td>
                        <td>{formatBits(tx_rate_l2)}</td>
                        <td>{formatBits(rx_rate_l2)}</td>
                        <td>{frame_size} B</td>
                        <td>{tx_rate_l2 > 0  && (1 - rx_rate_l2 / tx_rate_l2) > 0 ? (100 * (1 - rx_rate_l2 / tx_rate_l2)).toFixed(2) : "0.00"}%</td>
                        {/*<td>{formatBits(tx_rate * (stream.frame_size + 20)/stream.frame_size)}</td>*/}
                        {/*<td>{formatBits(rx_rate * (stream.frame_size + 20)/stream.frame_size)}</td>*/}
                        {/*<td>{formatBits(tx_rate)}</td>*/}
                        {/*<td>{formatBits(rx_rate)}</td>*/}
                        {/*<td>{tx_rate > 0  && (1 - rx_rate / tx_rate) > 0 ? (100 * (1 - rx_rate / tx_rate)).toFixed(2) : "0.00"}%</td>*/}
                    </tr>
                    </tbody>
                </Table>
            </Col>
        </Row>
    </>
}

export default StreamView