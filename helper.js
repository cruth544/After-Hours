module.exports = {
  changeTime: function (number) {
    var amOrPm = " am"
    if (number >= 13) {
      number -= 12
      amOrPm = " pm"
    } else if (number > 11 && number < 13) {
       amOrPm = " pm"
    } else if (number >= 0 && number < 1) {
       number += 12
       amOrPm = " am"
    }
    var minutes = number % 1
    number = number - minutes
    minutes = Math.floor(minutes * 60)
    minutes = minutes > 10 ? minutes : "0" + minutes
    return "" + number + ":" + minutes + amOrPm
  }
}
