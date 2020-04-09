using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using WebApplication1.Models;
using WebApplication1.EF;


namespace WebApplication1.Dao
{
    
    public class UserDao
    {
        Model1 db = null;
        public UserDao()
        {
            db = new Model1();
        }
        public long Insert(user entity)
        {
            db.users.Add(entity);
            db.SaveChanges();
            return 1;
        }

        public bool Login (string username, string password)
        {
            var result = db.users.Count(x => x.username == username && x.password == password);
            if (result > 0)
            {
                return true;
            } else
            {
                return false;
            }
        }

        public user GetById(string username)
        {
            return db.users.SingleOrDefault(x => x.username == username);
        }
    }
}