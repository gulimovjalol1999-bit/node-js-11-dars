import { useState } from "react"
import UploadImage from "../public/icon.jpg"


function App() {
  const [title, setTitle] = useState("")
  const [time, setTime] = useState("")
  const [image, setImage] = useState(null) 

  const handleFile = (event) => {
    const file = event.target.files[0];
    setImage(file)
  }

  const formData = new FormData()
  formData.append("title", title)
  formData.append("time", time)
  formData.append("file", image)

  const addData = (e) => {
    e.preventDefault()
    fetch("http://localhost:4001/add_data", {
      method: "POST",
      body: formData
    }).then((res) => res.json())
    .then((data) => alert(data.message))
  }

  return (
    <>
      <h1>Add data</h1>
      <form onSubmit={addData}>
        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)}/>
        <input type="text" value={time} onChange={(e) => setTime(e.target.value)}/>
        <label htmlFor="file">
          <img src={image ? URL.createObjectURL(image) : UploadImage} alt="" width={100} height={100}/>
        </label>
        <input type="file" onChange={(e) => handleFile(e)} id="file" style={{display: "none"}}/>
        <button type="submit">send</button>
      </form>
    </>
  )
}

export default App
