    $(document).foundation();

    $(function () {
      var data =
      {"start": "-1", "limit": "0", "num_found": "8", "docs":
      [
        {
            "title": "Questions of Character: Illuminating the Heart of Leadership Through Literature.",
            "creator": [
                "Badaracco, Joseph L., Jr."
            ],
            "measurement_page_numeric": 221,
            "measurement_height_numeric": 25,
            "shelfrank": 92,
            "pub_date": "2006",
            "link": "http://holliscatalog.harvard.edu/?itemid=|library/m/aleph|009189638"
        },
        {
            "title": "Leading Quietly: An Unorthodox Guide to Doing the Right Thing",
            "creator": [
                "Badaracco, Joseph L., Jr."
            ],
            "measurement_page_numeric": 382,
            "measurement_height_numeric": 25,
            "shelfrank": 57,
            "pub_date": "2002",
            "link": "http://holliscatalog.harvard.edu/?itemid=|library/m/aleph|009189638"
        },
        {
            "title": "Defining Moments: When Managers Must Choose between Right and Right",
            "creator": [
                "Badaracco, Joseph L., Jr."
            ],
            "measurement_page_numeric": 582,
            "measurement_height_numeric": 30,
            "shelfrank": 12,
            "pub_date": "1997",
            "link": "http://holliscatalog.harvard.edu/?itemid=|library/m/aleph|009189638"
        },
        {
            "title": "Business Ethics: Roles and Responsibilities.",
            "creator": [
                "Badaracco, Joseph L., Jr."
            ],
            "measurement_page_numeric": 582,
            "measurement_height_numeric": 35,
            "shelfrank": 42,
            "pub_date": "1994",
            "link": "http://holliscatalog.harvard.edu/?itemid=|library/m/aleph|009189638"
        },
        {
            "title": "The Knowledge Link",
            "creator": [
                "Badaracco, Joseph L., Jr."
            ],
            "measurement_page_numeric": 582,
            "measurement_height_numeric": 35,
            "shelfrank": 49,
            "pub_date": "1991",
            "link": "http://holliscatalog.harvard.edu/?itemid=|library/m/aleph|009189638"
        }
      ]
      };

      var horizontal_data =
      {"start": "-1", "limit": "0", "num_found": "3", "docs":
      [
        {
            "title": "Defining Moments: When Managers Must Choose between Right and Right",
            "creator": [
                "Badaracco, Joseph L., Jr."
            ],
            "measurement_page_numeric": 150,
            "measurement_height_numeric": 30,
            "shelfrank": 1,
            "pub_date": "1997",
            "link": "http://holliscatalog.harvard.edu/?itemid=|library/m/aleph|009189638"
        },
        {
            "title": "Business Ethics: Roles and Responsibilities.",
            "creator": [
                "Badaracco, Joseph L., Jr."
            ],
            "measurement_page_numeric": 150,
            "measurement_height_numeric": 35,
            "shelfrank": 1,
            "pub_date": "1994",
            "link": "http://holliscatalog.harvard.edu/?itemid=|library/m/aleph|009189638"
        },
        {
            "title": "Business Ethics: Roles and Responsibilities.",
            "creator": [
                "Badaracco, Joseph L., Jr."
            ],
            "measurement_page_numeric": 150,
            "measurement_height_numeric": 35,
            "shelfrank": 1,
            "pub_date": "1994",
            "link": "http://holliscatalog.harvard.edu/?itemid=|library/m/aleph|009189638"
        },
        {
            "title": "Business Ethics: Roles and Responsibilities.",
            "creator": [
                "Badaracco, Joseph L., Jr."
            ],
            "measurement_page_numeric": 150,
            "measurement_height_numeric": 35,
            "shelfrank": 1,
            "pub_date": "1994",
            "link": "http://holliscatalog.harvard.edu/?itemid=|library/m/aleph|009189638"
        },
        {
            "title": "Business Ethics: Roles and Responsibilities.",
            "creator": [
                "Badaracco, Joseph L., Jr."
            ],
            "measurement_page_numeric": 150,
            "measurement_height_numeric": 35,
            "shelfrank": 1,
            "pub_date": "1994",
            "link": "http://holliscatalog.harvard.edu/?itemid=|library/m/aleph|009189638"
        },
        {
            "title": "Business Ethics: Roles and Responsibilities.",
            "creator": [
                "Badaracco, Joseph L., Jr."
            ],
            "measurement_page_numeric": 150,
            "measurement_height_numeric": 35,
            "shelfrank": 1,
            "pub_date": "1994",
            "link": "http://holliscatalog.harvard.edu/?itemid=|library/m/aleph|009189638"
        },
        {
            "title": "Business Ethics: Roles and Responsibilities.",
            "creator": [
                "Badaracco, Joseph L., Jr."
            ],
            "measurement_page_numeric": 150,
            "measurement_height_numeric": 35,
            "shelfrank": 1,
            "pub_date": "1994",
            "link": "http://holliscatalog.harvard.edu/?itemid=|library/m/aleph|009189638"
        },
        {
            "title": "The Knowledge Link",
            "creator": [
                "Badaracco, Joseph L., Jr."
            ],
            "measurement_page_numeric": 150,
            "measurement_height_numeric": 35,
            "shelfrank": 1,
            "pub_date": "1991",
            "link": "http://holliscatalog.harvard.edu/?itemid=|library/m/aleph|009189638"
        }
      ]
      };

      $('#book-stack0').stackView({
          data: data,
          ribbon: "Badaracco, Joseph L., Jr.",
          horizontal: true
          });
      $('#book-stack1').stackView({
          data: data,
          ribbon: "Badaracco, Joseph L., Jr."
          });
      $('#book-stack2').stackView({
          data: data,
          ribbon: "Badaracco, Joseph L., Jr."
          });
      $('#related-stack').stackView({
          data: horizontal_data
          });
      $('#related-hbs-stack').stackView({
          data: horizontal_data
          });
    });

