export class Msg {
    msg:string;
    dt:Date;
    userid:number;

    constructor(_msg:string,_dt:Date,_userid:number)
    {
        this.msg = _msg;
        this.dt = _dt;
        this.userid = _userid;
    }

}
