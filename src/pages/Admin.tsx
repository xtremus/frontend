import { ShootingStars } from '@/components/ui/shooting-stars';
import { StarsBackground } from '@/components/ui/stars-background';

import { useNavigate } from 'react-router-dom';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { MdCancel } from 'react-icons/md';
import { MdCheckCircle } from 'react-icons/md';
import { MdDeleteForever } from 'react-icons/md';

import {
  getAdmins,
  getApprovedWfhReqs,
  getPendingWfhReqs,
  getRejectedWfhReqs,
  approveWfhReq,
  rejectWfhReq,
  deleteWfhRequest,
} from '@/db_reqs';
import { useEffect, useRef, useState } from 'react';

export function Admin() {
  const navigate = useNavigate();
  const [allAdmins, setAlladmins] = useState([]);
  const [pendingWfhReqs, setPendingWfhReqs] = useState([]);
  const [approvedWfhReqs, setApprovedWfhReqs] = useState([]);
  const [rejectedWfhReqs, setRejectedWfhReqs] = useState([]);
  const approverID = useRef(null);
  useEffect(() => {
    async function fetchall() {
      const admins = await getAdmins();
      setAlladmins(admins);
    }
    fetchall();
  }, []);

  return (
    <div className="h-screen bg-neutral-900 flex flex-col items-center w-full">
      <h2
        onClick={() => navigate('/')}
        className="cursor-pointer mt-2 flex-col md:flex-row z-10 text-3xl md:text-5xl md:leading-tight max-w-5xl mx-auto text-center tracking-tight font-medium bg-clip-text text-transparent bg-gradient-to-b from-neutral-800 via-white to-white flex items-center gap-2 md:gap-8"
      >
        <span>Admin Panel</span>
      </h2>
      <div className="z-50 bg-slate-200 p-5 mt-4 rounded shadow-sm h-5/6 w-5/6">
        <div className="flex flex-row justify-between">
          <h2 className="border-b pb-2 text-2xl font-semibold tracking-tight first:mt-0">
            Take Action on submitted WFH requests
          </h2>
          <Select
            onValueChange={async (val) => {
              approverID.current = val?.user_id;
              const allWfqReqs = await getPendingWfhReqs(val?.user_id);
              setPendingWfhReqs(allWfqReqs);
            }}
          >
            <SelectTrigger className="w-[180px] bg-white">
              <SelectValue placeholder="Select Admin" />
            </SelectTrigger>
            <SelectContent>
              {allAdmins.map((user, id) => {
                return (
                  <SelectItem key={id} value={user}>
                    {user?.name}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </div>
        <Tabs defaultValue="pending" className="w-full">
          <TabsList>
            <TabsTrigger
              value="pending"
              onClick={async () => {
                const allWfqReqs = await getPendingWfhReqs(approverID.current);
                setPendingWfhReqs(allWfqReqs);
              }}
            >
              Pending
            </TabsTrigger>
            <TabsTrigger
              value="approved"
              onClick={async () => {
                const allWfqReqs = await getApprovedWfhReqs(approverID.current);
                setApprovedWfhReqs(allWfqReqs);
              }}
            >
              Approved
            </TabsTrigger>
            <TabsTrigger
              value="rejected"
              onClick={async () => {
                const allWfqReqs = await getRejectedWfhReqs(approverID.current);
                setRejectedWfhReqs(allWfqReqs);
              }}
            >
              Rejected
            </TabsTrigger>
          </TabsList>
          <TabsContent value="pending">
            <Table>
              <TableCaption>A list of pending wfh requests.</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Request ID</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>From</TableHead>
                  <TableHead>To</TableHead>
                  <TableHead>Requestor</TableHead>
                  <TableHead>Submitted Date</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pendingWfhReqs.map((wfh_req, id) => {
                  return (
                    <TableRow key={id}>
                      <TableCell className="font-medium">
                        {wfh_req?.request_id}
                      </TableCell>
                      <TableCell>
                        {wfh_req?.from_datetime.split('T')[0]}
                      </TableCell>
                      <TableCell>
                        {wfh_req?.from_datetime.split('T')[1].slice(0, -3)}
                      </TableCell>
                      <TableCell>
                        {wfh_req?.to_datetime.split('T')[1].slice(0, -3)}
                      </TableCell>
                      <TableCell>{wfh_req?.name}</TableCell>
                      <TableCell>{wfh_req?.created_at.split('T')[0]}</TableCell>
                      <TableCell className="text-right flex flex-row justify-between">
                        <MdCheckCircle
                          className="text-lg hover:text-emerald-700 cursor-pointer"
                          onClick={() => {
                            approveWfhReq(wfh_req?.request_id).then(
                              async () => {
                                const allWfqReqs = await getPendingWfhReqs(
                                  approverID.current
                                );
                                setPendingWfhReqs(allWfqReqs);
                              }
                            );
                          }}
                        />
                        <MdCancel
                          className="text-lg hover:text-rose-800 cursor-pointer"
                          onClick={() => {
                            rejectWfhReq(wfh_req?.request_id).then(async () => {
                              const allWfqReqs = await getPendingWfhReqs(
                                approverID.current
                              );
                              setPendingWfhReqs(allWfqReqs);
                            });
                          }}
                        />
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TabsContent>
          <TabsContent value="approved">
            <Table>
              <TableCaption>A list of approved wfh requests.</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Request ID</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>From</TableHead>
                  <TableHead>To</TableHead>
                  <TableHead>Requestor</TableHead>
                  <TableHead>Submitted Date</TableHead>
                  <TableHead className="text-center">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {approvedWfhReqs.map((wfh_req, id) => {
                  return (
                    <TableRow key={id}>
                      <TableCell className="font-medium">
                        {wfh_req?.request_id}
                      </TableCell>
                      <TableCell>
                        {wfh_req?.from_datetime.split('T')[0]}
                      </TableCell>
                      <TableCell>
                        {wfh_req?.from_datetime.split('T')[1].slice(0, -3)}
                      </TableCell>
                      <TableCell>
                        {wfh_req?.to_datetime.split('T')[1].slice(0, -3)}
                      </TableCell>
                      <TableCell>{wfh_req?.name}</TableCell>
                      <TableCell>{wfh_req?.created_at.split('T')[0]}</TableCell>
                      <TableCell className="flex flex-row justify-center">
                        <MdDeleteForever
                          className="text-lg hover:text-rose-800 cursor-pointer"
                          onClick={() => {
                            deleteWfhRequest(wfh_req?.request_id).then(
                              async () => {
                                const allWfqReqs = await getApprovedWfhReqs(
                                  approverID.current
                                );
                                console.log('WFH Req ', allWfqReqs);
                                setApprovedWfhReqs(allWfqReqs);
                              }
                            );
                          }}
                        />
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TabsContent>
          <TabsContent value="rejected">
            <Table>
              <TableCaption>A list of rejected wfh requests.</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Request ID</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>From</TableHead>
                  <TableHead>To</TableHead>
                  <TableHead>Requestor</TableHead>
                  <TableHead>Submitted Date</TableHead>
                  <TableHead className="text-center">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rejectedWfhReqs.map((wfh_req, id) => {
                  return (
                    <TableRow key={id}>
                      <TableCell className="font-medium">
                        {wfh_req?.request_id}
                      </TableCell>
                      <TableCell>
                        {wfh_req?.from_datetime.split('T')[0]}
                      </TableCell>
                      <TableCell>
                        {wfh_req?.from_datetime.split('T')[1].slice(0, -3)}
                      </TableCell>
                      <TableCell>
                        {wfh_req?.to_datetime.split('T')[1].slice(0, -3)}
                      </TableCell>
                      <TableCell>{wfh_req?.name}</TableCell>
                      <TableCell>{wfh_req?.created_at.split('T')[0]}</TableCell>
                      <TableCell className="flex flex-row justify-center">
                        <MdDeleteForever
                          className="text-lg hover:text-rose-800 cursor-pointer"
                          onClick={() => {
                            deleteWfhRequest(wfh_req?.request_id).then(
                              async () => {
                                const allWfqReqs = await getRejectedWfhReqs(
                                  approverID.current
                                );
                                console.log('WFH Req ', allWfqReqs);
                                setRejectedWfhReqs(allWfqReqs);
                              }
                            );
                          }}
                        />
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TabsContent>
        </Tabs>
      </div>
      <ShootingStars />
      <StarsBackground />
    </div>
  );
}

export default Admin;
