from flask import Flask, jsonify, request, send_from_directory, abort
import os
import pymysql
import statistics

#ngrok.set_auth_token("3AKEvX4qI21UaAB4cX3yxgWk7FM_41AneqQLpQT1pi2P2jNzR")
app = Flask(__name__)

REACT_DIST = os.path.join(os.path.dirname(__file__), "..", "frontend", "dist")

@app.after_request
def cors_headers(response):
    response.headers["Access-Control-Allow-Origin"] = "*"
    response.headers["Access-Control-Allow-Methods"] = "GET, OPTIONS"
    response.headers["Access-Control-Allow-Headers"] = "Content-Type"
    return response

DB_CONFIG = {
    "host": "127.0.0.1",
    "user": "root",
    "password": "",
    "database": "cs179g"
}

CATEGORIES = {
    "Time-of-Day": {
        "Hourly Crimes": "hourly_crimes",
        "Time Period Crimes": "time_period_crimes"
    },
    "Seasonal / Monthly / Holiday": {
        "Monthly Crimes": "monthly_crimes",
        "Season Crimes": "season_crimes",
        "Holiday vs Non-Holiday": "holiday_vs_nonholiday",
        "Christmas": "christmas_by_type",
        "Thanksgiving": "thanksgiving_by_type",
        "Halloween": "halloween_by_type"
    },
    "Location-Based / Spatial": {
        "Crimes by Location": "crimes_by_location",
        "Crimes by Location & Type": "crimes_by_location_and_type",
        "Community Area Crimes": "community_area_crimes",
        "Airport Theft Comparison": "airport_theft_count_comparison",
        "Downtown vs Residential": "downtown_vs_residential_theft_robbery",
        "Transit vs Commercial": "transit_vs_commercial_robbery_count",
        "Theft by Location": "theft_by_location",
        "Sports Location Crimes": "sport_location_crimes",
        "Sports Location Crimes by Type": "sport_location_crimes_by_type"
    },
    "Long-Term Trends": {
        "Yearly Crimes": "yearly_crimes",
        "Great Recession by Type": "great_recession_by_type"
    }
}

def query_table(table_name):
    conn = pymysql.connect(**DB_CONFIG, cursorclass=pymysql.cursors.DictCursor)
    cursor = conn.cursor()
    cursor.execute(f"SELECT * FROM {table_name}")
    data = cursor.fetchall()
    conn.close()
    return data

ALLOWED_TABLES = {t for items in CATEGORIES.values() for t in items.values()}

@app.route("/api/categories")
def get_categories():
    return jsonify(CATEGORIES)

@app.route("/api/data")
def get_data():
    table = request.args.get("table")
    if not table or table not in ALLOWED_TABLES:
        return jsonify({"error": "Invalid or missing table name", "data": [], "stats": {}}), 400
    data = query_table(table)

    stats = {}
    if data and "count" in data[0]:
        counts = [row["count"] for row in data]
        stats["total"] = sum(counts)
        stats["average"] = round(statistics.mean(counts), 2)

    return jsonify({
        "data": data,
        "stats": stats
    })


@app.route("/")
def serve_react():
    if os.path.isdir(REACT_DIST) and os.path.isfile(os.path.join(REACT_DIST, "index.html")):
        return send_from_directory(REACT_DIST, "index.html")
    return "Run: cd frontend && npm run build", 404


@app.route("/<path:path>")
def serve_react_static(path):
    if path.startswith("api/"):
        abort(404)
    if os.path.isdir(REACT_DIST):
        full = os.path.join(REACT_DIST, path)
        if os.path.isfile(full):
            return send_from_directory(REACT_DIST, path)
        return send_from_directory(REACT_DIST, "index.html")
    abort(404)


if __name__ == "__main__":
    import argparse

    parser = argparse.ArgumentParser()
    parser.add_argument("--host", default="0.0.0.0")
    parser.add_argument("--port", default=5001, type=int)
    args = parser.parse_args()

    app.run(host=args.host, port=args.port, debug=True)
