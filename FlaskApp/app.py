import os

import pandas as pd
import numpy as np

import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine

from flask import Flask, jsonify, render_template
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)


#################################################
# Database Setup
#################################################

app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///db/suicide_rates_db.sqlite"
db = SQLAlchemy(app)

# reflect an existing database into a new model
Base = automap_base()
# reflect the tables
Base.prepare(db.engine, reflect=True)

# Save references to each table
suicide_rates_Metadata = Base.classes.suicide_rates
# Samples = Base.classes.samples


@app.route("/")
def index():
    """Return the homepage."""
    return render_template("index.html")


@app.route("/metadata/year/<year>")
def suicide_rates_by_year(year):
    sel = [
        suicide_rates_Metadata.COUNTRY,
        getattr(suicide_rates_Metadata, year),
    ]

    results = db.session.query(*sel).all()
    # Format the data to send as json
    data = {
        "countries": [result[0] for result in results],
        "suicide_rates": [result[1] for result in results],
    }

    return jsonify(data)

@app.route("/metadata/country/<country>")
def suicide_rates_by_country(country):

    stmt = db.session.query(suicide_rates_Metadata).statement

    df = pd.read_sql_query(stmt, db.session.bind)

    sample_data = df.loc[df['COUNTRY'] == country, :]

    years = [ year.split('_')[-1] for year in sample_data.columns.values[2:]]

    suicide_rates = sample_data.values[0][2:]

    data = {
        'year': years,
        'suicide_rates': suicide_rates.tolist(),
    }

    return jsonify(data)

@app.route("/countries")
def states():
    sel = [suicide_rates_Metadata.COUNTRY]

    countries = [country[0] for country in db.session.query(*sel).all()]

    return jsonify(countries)


@app.route("/years")
def years():
    stmt = db.session.query(suicide_rates_Metadata).statement

    df = pd.read_sql_query(stmt, db.session.bind)

    sample_data = df.loc[:,:]

    years = [year.split('_')[-1] for year in sample_data.columns.values[2:]]

    return jsonify(years)


if __name__ == "__main__":
    app.run()
