// get html text elements
const text = document.querySelectorAll('p')
//const text = document.querySelectorAll('h1, h2, h3, h4, h5, p, li, td, span')
const miles_in_km = 1.60934

//function to convert miles to km
function miToKm(miles) {
  return (miles * miles_in_km).toFixed(2)
}
//function to coonvert mins:seconds/mile to mins:seconds/km
function miToKmPace(mins, seconds) {
  mins = parseFloat(mins)
  seconds = parseFloat(seconds)

  var num_seconds = mins * 60.0 + seconds
  var km_per_second = num_seconds * (1 / miles_in_km)

  mins = Math.floor(km_per_second / 60.0)
  seconds = (km_per_second - mins * 60.0).toFixed(0)
  seconds = String(seconds)
  //pad with zero if necessary
  if (seconds.length == 1) {
    seconds = '0'.concat(seconds)
  }
  return [String(mins), seconds]
}

const re = new RegExp(/([\d]+[\.]*[\d]*)+[\s|a-zA-Z]*[\s]*(?<![per][\s*]|[\/])(miles|mile|-mile)(?!age)/)
const re_pace = new RegExp(/([\d]+)[:]+([\d]+)[\s|a-zA-Z|/]*[\s]*(miles|mile|-mile)(?!age)/)
// main loop; here is where we replace the text on the page
for (let i = 0; i < text.length; i++) {
  //perform a regex match on t and replace each match with appropriate string
  // Distance case (e.g. replacing "You should run 10 to 15 miles")
  // this regex matches ranges of (e.g. 10 to 15 miles, 5 or 10 miles for a max of 2 number matches)
  console.log('for++')
  var txt = text[i].innerHTML
  //console.log(txt)
  //console.log(txt.match(re))

  console.log('In the first loop')
  while ((found = re.exec(txt)) != null) {
    console.log('while++')
    var full_txt = found[0] //this is the full phrase to replace
  
    // first mile value replace
    console.log(found)
    var mi_1 = found[1]
    if (mi_1 !== undefined) {
      var a = miToKm(parseFloat(mi_1))
      full_txt = full_txt.replace(mi_1, a)
    }
  
    // replace 'mile' string w km as long as at least one number replaced
    var dist = found[2]
    if ((mi_1 !== undefined) && (dist !== undefined)) {
      full_txt = full_txt.replace('mile', 'km')
    }
    txt = txt.replace(found[0], full_txt)
  } 

  console.log('In the second loop')
  while ((found_pace = re_pace.exec(txt)) != null) {
    // Pace case (e.g. replacing "Race pace is 4:30/mile")
    var pace_txt = found_pace[0]
    var min = found_pace[1]
    var sec = found_pace[2]
    var dist = found_pace[3]
  
    if ((min !== undefined) && (sec !== undefined) && (dist !== undefined)) {
      var new_pace = miToKmPace(min, sec)
      pace_txt = pace_txt.replace(found_pace[1], new_pace[0]).replace(found_pace[2], new_pace[1]).replace('mile', 'km')
      txt = txt.replace(found_pace[0], pace_txt)
    }
  } 
  
  text[i].innerHTML = txt 
} 