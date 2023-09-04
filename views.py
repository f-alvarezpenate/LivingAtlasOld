from flask import Blueprint, render_template, redirect, url_for

views = Blueprint(__name__,"views")

@views.route("/")
def home():
    return render_template("index.html")

@views.route("/login")
def login():
    return render_template("login.html")

@views.route("/register")
def register():
    return render_template("register.html")

@views.route("/reset-password")
def reset_password():
    return render_template("forgotpw.html")

@views.route("/submit-feature")
def submit_feature():
    return render_template("submission.html")