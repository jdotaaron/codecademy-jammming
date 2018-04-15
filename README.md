This project was created for Codecademy's "Build Front-End Web Applications from Scratch" Intensive.
Jammming (Part 1)

## Table of Contents

- [Known Bugs](#known-bugs)

## Known Bugs

* For whatever reason I could only put `{Authorization: ``Bearer ${accessToken}``}` as is when putting `headers` for `POST` instead of saving it to a variable `header` and using that instead. The result of which would give a `Error 400: Bad Request`

* Being previously logged into Spotify, then opening webpage, then searching wipes resets the page. After initial search and page reset, app works fine.
