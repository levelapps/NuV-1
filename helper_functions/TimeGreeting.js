export function currentTime(){
  var date = new Date();
  var hours = date.getHours();
  var minutes = date.getMinutes();

  return {hours: hours, minutes: minutes}
}

export function getTimeBasedGreeting(user){
  var timeNow = currentTime();

  if (timeNow.hours > 22 || timeNow.hours < 5){
    return `You're up late ${user}!`
  }
  else if (timeNow.hours > 4 && timeNow.hours < 8){
    return `You're up early ${user}!`
  }
  else if (timeNow.hours > 7 && timeNow.hours < 12){
    return `Good morning ${user}!`
  }
  else if (timeNow.hours > 11 && timeNow.hours < 18){
    return `Good afternoon ${user}!`
  }
  else if (timeNow.hours > 17 && timeNow.hours < 23){
    return `Good evening ${user}!`
  }
}
