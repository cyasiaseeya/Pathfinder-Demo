#!/bin/bash
kill $(lsof -ti:3000) 2>/dev/null
sleep 1
npm run dev
