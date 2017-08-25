#!/bin/bash
mongoimport --db qi --collection ra_model_portfs --upsert --file ra_model_portf.json
