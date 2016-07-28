from datetime import datetime, timedelta
from pytz import timezone
import pytz
from dateutil.parser import parse  # for parsing
from dateutil.relativedelta import relativedelta
from time import mktime


class TimeConversion():

    def currentUtcTime(self):
        """
        USAGE:
        date_var = TimeConversion().currentUtcTime()

        """
        # print datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S")
        # return datetime.now(tz=pytz.utc).isoformat()
        utc = pytz.utc
        return utc.localize(datetime.utcnow())
        # fmt = '%Y-%m-%d %H:%M:%S %Z%z'
        # x = utc.localize(datetime.utcnow())
        # str_t = x.strftime(fmt)
        # print str(str_t)

    def otherToUtc(self, other_date_obj):
        """
        USAGE:
        date_var = TimeConversion().otherToUtc('2006-03-27 08:34:59 AEDT+1100', 'Australia/Sydney')

        """
        utc = pytz.utc
        # to_utc_tz = timezone(from_timezone_str)
        result_date = utc.normalize(other_date_obj.astimezone(utc))
        return result_date

    def fromUtcToOther(self, utc_date_obj, from_timezone_str):
        pass
        """
            USAGE:
            date_var = TimeConversion().fromUtcToOther("2015-11-28 17:04:09+00:00", 'Australia/Sydney')

        """

        from_utc_tz = timezone(from_timezone_str)
        result_date = from_utc_tz.normalize(
            utc_date_obj.astimezone(from_utc_tz))
        return result_date

    # def utcToOtherTimezone(self):
    #     pass
    #     timezone_dict = {"IST": "Asia/Kolkata",
    #                      "PST": "US/Pacific",
    #                      "eastern": "US/Eastern"}

    #     utc = pytz.utc
    #     # print utc.zone
    #     to_zone = timezone('US/Eastern')
    #     loc_dt = to_zone.localize(datetime.utcnow())
    #     print loc_dt

    #     # converting time zone
    #     utc_dt = utc.localize(datetime.utcfromtimestamp(1143408899))
    #     au_tz = timezone('Australia/Sydney')
    #     au_dt = au_tz.normalize(utc_dt.astimezone(au_tz))

        # example
        # fmt = '%Y-%m-%d %H:%M:%S %Z%z'
        # before = loc_dt - timedelta(minutes=10)
        # before.strftime(fmt)
        # # '2002-10-27 00:50:00 EST-0500'
        # eastern = timezone_dict["eastern"]
        # eastern.normalize(before).strftime(fmt)
        # # '2002-10-27 01:50:00 EDT-0400'
        # after = eastern.normalize(before + timedelta(minutes=20))
        # after.strftime(fmt)
        # '2002-10-27 01:10:00 EST-0500

    def strToDateObj(self, date_string):
        # pass
        """Convert Datetime String to DateTime Object
            USAGE:
            datetime_obj = TimeConversion().strToDateTimeObj("2015-11-28 13:58:01")

            NOTE:
            - This function can be extended in future to support various
            time formats
            -
        """
        fmt = {"date_time": "%Y-%m-%d %H:%M:%S",
               # 2015-11-28 13:58:01 UTC+0000
               "date_timezone": "%Y-%m-%d %H:%M:%S %Z%z"
               }
        # datetime_obj = datetime.strptime(date_string, fmt["date_time"])
        datetime_obj = parse(date_string)
        return datetime_obj

    def changeDate(self, datetime_obj, timezone_str, years=0, days=0, minutes=0):
        """
            USAGE:
            t = TimeConversion().changeDate(+30)

            returns Datetime String (timezone = UTC)
        """
        # t = (datetime.utcnow() + timedelta(days=number_of_days)
        # ).strftime("%Y-%m-%d %H:%M:%S")
        tz_var = timezone(timezone_str)
        result_date = tz_var.normalize(
            datetime_obj + relativedelta(years=years, days=days, minutes=minutes))
        """timedelta give problem when leap year comes in
        """
        # after = eastern.normalize(before + timedelta(days=number_of_days))
        return result_date

    def datetime_to_timestamp(self, datetime_obj):
        return mktime(datetime_obj.timetuple())

    def timeLeft(self, datetime_obj1, datetime_obj2, string=0):
        """
        send string = 1 if you are sending string of datetime object
        NOTE:
        this return output irrespectime of time difference
        """
        t1 = self.datetime_to_timestamp(datetime_obj1)
        t2 = self.datetime_to_timestamp(datetime_obj2)
        sec = t2 - t1

        # if t2 > t1:
        #     sec = t2 - t1
        # else:
        #     sec = t1 - t2

        result = self.secondsToOther(sec)
        return result
        # else:
            # return "Error: try "

    def secondsToOther(self, sec):
        weeks, days, hours, minutes = 0, 0, 0, 0
        flag = 0
        sec_in_week = 604800

        if sec < 0:
            flag = 1
            sec = abs(sec)

        time_diff = sec

        if sec >= sec_in_week:
            weeks = sec//sec_in_week
            sec -= sec_in_week*weeks
        if sec >= 86400.00:
            print "days"
            days = sec//86400
            sec -= 86400*days
            print sec
        if sec >= 3600.00:
            print "hr"
            hours = sec//3600
            sec -= 3600*hours
            # print sec
            # print sec = sec -
        if sec >= 60.00:
            print "minutes"
            minutes = sec//60
            sec -= 60*minutes
            print sec

        # print "weeks, days, hours, minutes, seconds:", weeks, days, hours, minutes, sec
        data = {"weeks": weeks,
                "days": days,
                "hours": hours,
                "minutes": minutes,
                "seconds": sec,
                "total_sec_left": time_diff }
        if flag:
            for key in data:
                data[key]*=(-1)
        return data
