import { ShootingStars } from '@/components/ui/shooting-stars';
import { StarsBackground } from '@/components/ui/stars-background';

import { useNavigate } from 'react-router-dom';

import { CalendarIcon } from '@radix-ui/react-icons';
import { MdModeEdit } from 'react-icons/md';
import { MdDeleteForever } from 'react-icons/md';
import { format, set } from 'date-fns';
import { cn } from '@/lib/utils';

import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { FaRegClock } from 'react-icons/fa';
import { Label } from '@/components/ui/label';
import { TimePickerInput } from '@/components/ui/time-picker/time-picker-input';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { useEffect, useRef, useState } from 'react';

import {
  getAdmins,
  getUsers,
  getWfhRequests,
  addWfhRequest,
  updateWfhRequest,
  deleteWfhRequest,
} from '@/db_reqs';

export function Employee() {
  const navigate = useNavigate();
  const from_minRef = useRef(null);
  const from_hourRef = useRef(null);
  const to_minRef = useRef(null);
  const to_hourRef = useRef(null);
  const userID = useRef(null);
  const approverID = useRef(null);
  const reqID = useRef(null);
  const [allUsers, setAllusers] = useState([]);
  const [allAdmins, setAlladmins] = useState([]);
  const [wfhReqs, setWfhReqs] = useState([]);
  const [selectedDate, setSelectedDate] = useState();
  const [from_datetime, setFrom_DateTime] = useState(createDateTime(9, 0));
  const [to_datetime, setTo_DateTime] = useState(createDateTime(17, 0));
  const editFlag = useRef(false);

  function createDateTime(hours: number, minutes: number) {
    const now = new Date();
    now.setHours(hours);
    now.setMinutes(minutes);
    now.setSeconds(0);
    return now;
  }

  useEffect(() => {
    async function fetchall() {
      const users = await getUsers();
      const admins = await getAdmins();
      setAllusers(users);
      setAlladmins(admins);
    }
    fetchall();
  }, []);

  function handleSubmit() {
    if (
      selectedDate &&
      from_datetime &&
      to_datetime &&
      userID.current &&
      approverID.current
    ) {
      const substring = selectedDate.toDateString();

      const date = new Date(substring);

      const year = date.toLocaleString('default', { year: 'numeric' });
      const month = date.toLocaleString('default', { month: '2-digit' });
      const day = date.toLocaleString('default', { day: '2-digit' });

      const formattedDate = year + '-' + month + '-' + day;
      console.log(formattedDate);

      const wfh_req = {
        user_id: userID.current,
        from_datetime: formattedDate + ' ' + from_datetime.toLocaleTimeString(),
        to_datetime: formattedDate + ' ' + to_datetime.toLocaleTimeString(),
        approver_id: approverID.current,
      };

      const wfh_req_updt = {
        request_id: reqID.current,
        from_datetime: formattedDate + ' ' + from_datetime.toLocaleTimeString(),
        to_datetime: formattedDate + ' ' + to_datetime.toLocaleTimeString(),
        approver_id: approverID.current,
      };

      console.log('Wfq_Request', wfh_req);

      if (!editFlag) {
        addWfhRequest(wfh_req).then(async () => {
          const allWfqReqs = await getWfhRequests(userID.current);
          console.log('WFH Req ', allWfqReqs);
          setWfhReqs(allWfqReqs);
        });
      } else {
        updateWfhRequest(wfh_req_updt).then(async () => {
          const allWfqReqs = await getWfhRequests(userID.current);
          console.log('WFH Req ', allWfqReqs);
          setWfhReqs(allWfqReqs);
        });
      }
    }
  }

  return (
    <div className="h-screen bg-neutral-900 flex flex-col items-center w-full">
      <h2
        onClick={() => navigate('/')}
        className="cursor-pointer mt-2 flex-col md:flex-row z-10 text-3xl md:text-5xl md:leading-tight max-w-5xl mx-auto text-center tracking-tight font-medium bg-clip-text text-transparent bg-gradient-to-b from-neutral-800 via-white to-white flex items-center gap-2 md:gap-8"
      >
        <span>Employee Panel</span>
      </h2>
      <div className="z-50 bg-slate-200 p-5 mt-4 rounded shadow-sm h-5/6 w-5/6">
        <div className="flex flex-row justify-between">
          <h2 className="border-b pb-2 text-2xl font-semibold tracking-tight first:mt-0">
            Raise your WFH request
          </h2>

          <Select
            onValueChange={async (val) => {
              userID.current = val?.user_id;
              const allWfqReqs = await getWfhRequests(val?.user_id);
              console.log('WFH Req ', allWfqReqs);
              setWfhReqs(allWfqReqs);
            }}
          >
            <SelectTrigger className="w-[180px] bg-white">
              <SelectValue placeholder="Select Employee" />
            </SelectTrigger>
            <SelectContent>
              {allUsers.map((user, id) => {
                return (
                  <SelectItem key={id} value={user}>
                    {user?.name}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-8 mt-2 p-4 border-black rounded-sm border-2 shadow-xl">
          <div className="flex flex-col gap-1 justify-between md:flex-row">
            <div className="flex flex-col">
              <Label>Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={'outline'}
                    className={cn(
                      'w-[240px] justify-start text-left font-normal',
                      !selectedDate && 'text-muted-foreground'
                    )}
                  >
                    <CalendarIcon />
                    {selectedDate ? (
                      format(selectedDate, 'PPP')
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="flex flex-col">
              <Label>From</Label>
              <div className="flex items-end gap-2">
                <div className="grid gap-1 text-center">
                  {/* <Label htmlFor="hours" className="text-xs">
                      Hours
                    </Label> */}
                  <TimePickerInput
                    className="bg-white"
                    picker="hours"
                    date={from_datetime}
                    setDate={setFrom_DateTime}
                    ref={from_hourRef}
                    onRightFocus={() => from_minRef.current?.focus()}
                  />
                </div>
                <div className="grid gap-1 text-center">
                  {/* <Label htmlFor="minutes" className="text-xs">
                      Minutes
                    </Label> */}
                  <TimePickerInput
                    className="bg-white"
                    picker="minutes"
                    date={from_datetime}
                    setDate={setFrom_DateTime}
                    ref={from_minRef}
                    onLeftFocus={() => from_hourRef.current?.focus()}
                  />
                </div>
                <div className="flex h-10 items-center">
                  <FaRegClock className="ml-2 h-4 w-4" />
                </div>
              </div>
            </div>

            <div className="flex flex-col">
              <Label>To</Label>
              <div className="flex items-end gap-2">
                <div className="grid gap-1 text-center">
                  {/* <Label htmlFor="hours" className="text-xs">
                      Hours
                    </Label> */}
                  <TimePickerInput
                    className="bg-white"
                    picker="hours"
                    date={to_datetime}
                    setDate={setTo_DateTime}
                    ref={to_hourRef}
                    onRightFocus={() => to_minRef.current?.focus()}
                  />
                </div>
                <div className="grid gap-1 text-center">
                  {/* <Label htmlFor="minutes" className="text-xs">
                      Minutes
                    </Label> */}
                  <TimePickerInput
                    className="bg-white"
                    picker="minutes"
                    date={to_datetime}
                    setDate={setTo_DateTime}
                    ref={to_minRef}
                    onLeftFocus={() => to_hourRef.current?.focus()}
                  />
                </div>
                <div className="flex h-10 items-center">
                  <FaRegClock className="ml-2 h-4 w-4" />
                </div>
              </div>
            </div>
          </div>

          <div>
            <Label>Approver</Label>
            <Select
              onValueChange={(val) => {
                approverID.current = val?.user_id;
              }}
            >
              <SelectTrigger className="w-1/3 bg-white">
                <SelectValue placeholder="Select an approver" />
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

          <Button type="submit" onClick={() => handleSubmit()}>
            Submit
          </Button>
        </div>

        <h2 className="border-b mt-4 pb-2 text-xl font-semibold tracking-tight first:mt-0">
          Submitted WFH request
        </h2>
        <Table>
          <TableCaption>A list of your recent wfh requests.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Request ID</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>From</TableHead>
              <TableHead>To</TableHead>
              <TableHead>Approver</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {wfhReqs.map((wfhReq, id) => {
              return (
                <TableRow key={id}>
                  <TableCell className="font-medium">
                    {wfhReq?.request_id}
                  </TableCell>
                  <TableCell>{wfhReq?.from_datetime.split(' ')[0]}</TableCell>
                  <TableCell>
                    {wfhReq?.from_datetime.split(' ')[1].slice(0, -3)}
                  </TableCell>
                  <TableCell>
                    {wfhReq?.to_datetime.split(' ')[1].slice(0, -3)}
                  </TableCell>
                  <TableCell>{wfhReq?.approver_name}</TableCell>
                  <TableCell>{wfhReq?.status}</TableCell>
                  <TableCell className="text-right flex flex-row justify-between">
                    {wfhReq?.status !== 'Approved' && (
                      <>
                        <MdModeEdit
                          className="text-lg hover:text-sky-700 cursor-pointer"
                          onClick={() => {
                            console.log('Edit Mode', wfhReq);
                            reqID.current = wfhReq.request_id;
                            setSelectedDate(new Date(wfhReq.from_datetime));
                            setFrom_DateTime(new Date(wfhReq.from_datetime));
                            setTo_DateTime(new Date(wfhReq.to_datetime));
                          }}
                        />
                        <MdDeleteForever
                          className="text-lg hover:text-red-700 cursor-pointer"
                          onClick={() => {
                            deleteWfhRequest(wfhReq?.request_id).then(
                              async () => {
                                const allWfqReqs = await getWfhRequests(
                                  userID.current
                                );
                                console.log('WFH Req ', allWfqReqs);
                                setWfhReqs(allWfqReqs);
                              }
                            );
                          }}
                        />
                      </>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      <ShootingStars />
      <StarsBackground />
    </div>
  );
}

export default Employee;
