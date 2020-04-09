using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using WebApplication1.Models;
using WebApplication1.Dao;
using WebApplication1.common;

namespace WebApplication1.Controllers
{
    public class LoginController : Controller
    {
        // GET: Login
        public ActionResult Index()
        {
            return View();
        }

        public ActionResult Login(LoginModel model)
        {
            var dao = new UserDao();
            var result = dao.Login(model.username, model.password);
            if(result)
            {
                var user = dao.GetById(model.username);
                var userSession = new UserLogin();
                userSession.username = user.username;
                userSession.userId = user.id;
                Session.Add("huong", userSession);
                return RedirectToAction("Index", "Home");
            } else
            {
                ModelState.AddModelError("", "Ddawng nhaapj khoong ddungs!");
            }
            return View("Index");
        }
    }
}