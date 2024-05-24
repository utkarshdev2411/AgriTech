
import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import axios from 'axios'

const SoilDiagnosis = () => {
    
    const { control, register, handleSubmit, watch,reset, setValue, formState: { errors, isSubmitting } } = useForm();
    const [isCustom, setIsCustom] = useState(false);
    const [report, setReport] = useState();
    const selectedOption = watch('irrigation', '');
    const [loading,setLoading]=useState(false)

    const [isReportVisible, setIsReportVisible] = useState(false);
    const onSubmit = async (data) => {
        setLoading(true) // changed loading
        const irrigation = selectedOption === 'custom' ? data.customIrrigation : data.irrigation;
        
        // Create a FormData object to hold the form data
        const formData = new FormData();
        
        formData.append('rainfall', data.rainfall);
        formData.append('temp', data.temp);
        formData.append('area', data.area);
        formData.append('irrigation', irrigation);
        formData.append("report", report)
        console.log(formData)

        await axios.post('http://localhost:8000/diagnosis/soil', formData, {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        }).then((res) => {
            console.log(res)

        }).catch(err => {
            console.log(err)
        })
        reset(); 
        // Make a POST request to the Flask API
    const res = await axios.post('http://localhost:5123/report', formData, {
        headers: {
            "Content-Type": "multipart/form-data"
        }
    });
    setReport(res.data);
    setLoading(false);

    reset(); 
    console.log(report)
 
    }
    
     return (

        <div className=' min-h-[88vh] w-full flex flex-col lg:flex-row items-center sm:p-5 lg:p-0 justify-center gap-20  bg-[#f4fdf7]'>
            <div className=' flex flex-col-reverse justify-center  h-full'>

                {/* form section */}
                <div>
                    <form className='flex flex-col justify-center  py-10 ' onSubmit={handleSubmit(onSubmit)}>
                        <label className='self-start mb-2' htmlFor="rainfall">Rainfall (in mm)</label>
                        <input
                            className="mb-3 border-[1px] px-3 py-2 rounded-sm border-gray-400 outline-none"
                            type="text"
                            id="rainfall"
                            {...register("rainfall", {
                                required: "Rainfall data is required",

                            })}
                            placeholder="Enter the rainfall in mm"
                        />
                        {errors.rainfall && <h1 className='text-red-500 text-sm -mt-2' >*{errors.rainfall.message}</h1>}
                        <label className='self-start mb-2' htmlFor="temp">Temperature (in °C)</label>
                        <input
                            className=" mb-3 border-[1px] px-3 py-2 rounded-sm border-gray-400 outline-none"
                            type="text"
                            id="temp"
                            {...register("temp", {
                                required: "temp must be required",
                            })}
                            placeholder="Enter the temperature in °C"
                        />
                        {errors.temp && <h1 className='text-red-500 text-sm -mt-2' >*{errors.temp.message}</h1>}
                        <label className='self-start mb-2' htmlFor="area">Land Area (in Km²)</label>
                        <input
                            className="mb-3 border-[1px] px-3 py-2 rounded-sm border-gray-400 outline-none"
                            type="text"
                            id="area"
                            {...register("area", {
                                required: "Area must be required",
                            })}
                            placeholder="Enter the area in Km²"
                        />

                        {errors.area && <h1 className='text-red-500 text-sm -mt-2' >*{errors.area.message}</h1>}

                        {/* selection part */}
                        <label className='self-start mb-2' htmlFor="irrigation">Select irrigation Technique</label>
                        <Controller
                            name="irrigation"
                            control={control}
                            defaultValue=""
                            render={({ field }) => (
                                <select
                                    {...register("irrigation", {
                                        required: "irrigation method required",
                                    })}
                                    className='outline-none px-3 py-2 rounded-sm border-[1px] border-gray-400'
                                    id="irrigation"
                                    {...field}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        field.onChange(value);
                                        setIsCustom(value === 'custom');
                                        if (value !== 'custom') {
                                            setValue('customIrrigation', '');
                                        }
                                    }}
                                >
                                    <option value="">--Select an option--</option>
                                    <option value="well and tubewell">Well and Tubewell</option>
                                    <option value="Sprinkler">Sprinkler</option>
                                    <option value="Drip">Drip</option>
                                    <option value="canal">Canal</option>
                                    <option value="tank">Tank</option>
                                    <option value="custom">Other (Please specify)</option>
                                </select>
                            )}
                        />
                        {errors.irrigation && <h1 className='text-red-500 text-sm -mt-2' >*{errors.irrigation.message}</h1>}
                        {selectedOption === 'custom' && (
                            <Controller
                                name="customIrrigation"
                                control={control}
                                defaultValue=""
                                render={({ field }) => (
                                    <input
                                        className="m-3 border-[1px] px-3 py-2 rounded-sm border-gray-400 outline-none"
                                        {...field}
                                        type="text"
                                        placeholder="Please specify"
                                        onChange={(e) => {
                                            field.onChange(e);
                                            setValue('irrigation', 'custom');
                                        }}
                                    />
                                )}
                            />
                        )}

                        {/* file section */}
                        <div className='my-3 bg-slate-50 px-12 py-5  flex  flex-col-reverse rounded-sm border-[1px] border-slate-300 items-center justify-center '>
                            <label accept="application/pdf" className='text-sm cursor-pointer mt-5 text-gray-400 text-center' htmlFor="report">Click here to upload a File</label>
                            <input
                                onChange={(e) => setReport(e.target.files[0])}
                                className=" cursor-pointer self-center truncate" type="file" name='report' id='report' placeholder='Upload your File here' />
                        </div>

                        <button onClick={() => setIsReportVisible(!isReportVisible)} type='submit' className=' py-2 bg-slate-800 text-white text-md font-semi-bold'>{isSubmitting ? "...Loading" : "Check report"}</button>
                    </form>
                </div>
            </div>

            {/* output section */}


            {isReportVisible && (
        <div style={{ scrollbarWidth: "none" }} className='relative h-[60vh] overflow-y-auto  w-full lg:w-[30vw] rounded-md bg-slate-50 border-[2px] border-slate-400 '>
          <h1 className='text-center text-xl sticky flex items-center justify-center top-0 h-10 bg-slate-800 bg-opacity-85 text-white mb-3 left-1/2 t font-semibold tracking-wide'>Result Shown here</h1>
          <div className='px-8 mb-4'>
          {loading ? <img className="m-auto " src={"https://media2.giphy.com/media/3oEjI6SIIHBdRxXI40/200w.gif?cid=6c09b9520qwkh1x7cxjjd5lr3xt43g99jzpye40tzein23u4&ep=v1_gifs_search&rid=200w.gif&ct=g"} alt="" /> :
            <p className='text-sm text-gray-800'>{report.answer}</p>}
          </div>
        </div>
      )}
        </div>



    )
}

export default SoilDiagnosis;









// import React, { useState } from 'react';
// import { Controller, useForm } from 'react-hook-form';
// import axios from 'axios'


// const SoilDiagnosis = () => {
//     const { control, register, handleSubmit, watch,reset, setValue, formState: { errors, isSubmitting } } = useForm();
//     const [isCustom, setIsCustom] = useState(false);
//     const [report, setReport] = useState();
//     const selectedOption = watch('irrigation', '');


//     const onSubmit = async (data) => {
//         console.log(data)
        
//         const irrigation = selectedOption === 'custom' ? data.customIrrigation : data.irrigation;
        
//         // Create a FormData object to hold the form data
//         const formData = new FormData();
        
//         formData.append('rainfall', data.rainfall);
//         formData.append('temp', data.temp);
//         formData.append('area', data.area);
//         formData.append('irrigation', irrigation);
//         formData.append("report", report)

//         await axios.post('http://localhost:8000/diagnosis/soil', formData, {
//             headers: {
//                 "Content-Type": "multipart/form-data"
//             }
//         }).then((res) => {
//             console.log(res)
//         }).catch(err => {
//             console.log(err)
//         })
//         reset(); 
//     }

//     return (

//         <div className=' min-h-[88vh] w-full flex flex-col lg:flex-row items-center sm:p-5 lg:p-0 justify-center gap-20  bg-[#f4fdf7]'>
//             <div className=' flex flex-col-reverse justify-center  h-full'>

//                 {/* form section */}
//                 <div>
//                     <form className='flex flex-col justify-center  py-10 ' onSubmit={handleSubmit(onSubmit)}>
//                         <label className='self-start mb-2' htmlFor="rainfall">Rainfall (in mm)</label>
//                         <input
//                             className="mb-3 border-[1px] px-3 py-2 rounded-sm border-gray-400 outline-none"
//                             type="text"
//                             id="rainfall"
//                             {...register("rainfall", {
//                                 required: "Rainfall data is required",

//                             })}
//                             placeholder="Enter the rainfall in mm"
//                         />
//                         {errors.rainfall && <h1 className='text-red-500 text-sm -mt-2' >*{errors.rainfall.message}</h1>}
//                         <label className='self-start mb-2' htmlFor="temp">Temperature (in °C)</label>
//                         <input
//                             className=" mb-3 border-[1px] px-3 py-2 rounded-sm border-gray-400 outline-none"
//                             type="text"
//                             id="temp"
//                             {...register("temp", {
//                                 required: "temp must be required",
//                             })}
//                             placeholder="Enter the temperature in °C"
//                         />
//                         {errors.temp && <h1 className='text-red-500 text-sm -mt-2' >*{errors.temp.message}</h1>}
//                         <label className='self-start mb-2' htmlFor="area">Land Area (in Km²)</label>
//                         <input
//                             className="mb-3 border-[1px] px-3 py-2 rounded-sm border-gray-400 outline-none"
//                             type="text"
//                             id="area"
//                             {...register("area", {
//                                 required: "Area must be required",
//                             })}
//                             placeholder="Enter the area in Km²"
//                         />

//                         {errors.area && <h1 className='text-red-500 text-sm -mt-2' >*{errors.area.message}</h1>}

//                         {/* selection part */}
//                         <label className='self-start mb-2' htmlFor="irrigation">Select irrigation Technique</label>
//                         <Controller
//                             name="irrigation"
//                             control={control}
//                             defaultValue=""
//                             render={({ field }) => (
//                                 <select
//                                     {...register("irrigation", {
//                                         required: "irrigation method required",
//                                     })}
//                                     className='outline-none px-3 py-2 rounded-sm border-[1px] border-gray-400'
//                                     id="irrigation"
//                                     {...field}
//                                     onChange={(e) => {
//                                         const value = e.target.value;
//                                         field.onChange(value);
//                                         setIsCustom(value === 'custom');
//                                         if (value !== 'custom') {
//                                             setValue('customIrrigation', '');
//                                         }
//                                     }}
//                                 >
//                                     <option value="">--Select an option--</option>
//                                     <option value="well and tubewell">Well and Tubewell</option>
//                                     <option value="Sprinkler">Sprinkler</option>
//                                     <option value="Drip">Drip</option>
//                                     <option value="canal">Canal</option>
//                                     <option value="tank">Tank</option>
//                                     <option value="custom">Other (Please specify)</option>
//                                 </select>
//                             )}
//                         />
//                         {errors.irrigation && <h1 className='text-red-500 text-sm -mt-2' >*{errors.irrigation.message}</h1>}
//                         {selectedOption === 'custom' && (
//                             <Controller
//                                 name="customIrrigation"
//                                 control={control}
//                                 defaultValue=""
//                                 render={({ field }) => (
//                                     <input
//                                         className="m-3 border-[1px] px-3 py-2 rounded-sm border-gray-400 outline-none"
//                                         {...field}
//                                         type="text"
//                                         placeholder="Please specify"
//                                         onChange={(e) => {
//                                             field.onChange(e);
//                                             setValue('irrigation', 'custom');
//                                         }}
//                                     />
//                                 )}
//                             />
//                         )}

//                         {/* file section */}
//                         <div className='my-3 bg-slate-50 px-12 py-5  flex  flex-col-reverse rounded-sm border-[1px] border-slate-300 items-center justify-center '>
//                             <label accept="application/pdf" className='text-sm cursor-pointer mt-5 text-gray-400 text-center' htmlFor="report">Click here to upload a File</label>
//                             <input
//                                 onChange={(e) => setReport(e.target.files[0])}
//                                 className=" cursor-pointer self-center truncate" type="file" name='report' id='report' placeholder='Upload your File here' />
//                         </div>

//                         <button type='submit' className=' py-2 bg-slate-800 text-white text-md font-semi-bold'>{isSubmitting ? "...Loading" : "Check report"}</button>
//                     </form>
//                 </div>
//             </div>

//             {/* output section */}

//             <div style={{ scrollbarWidth: "none" }} className='relative h-[60vh] overflow-y-auto  w-full lg:w-[30vw] rounded-md bg-slate-50 border-[2px] border-slate-400 '>
//                 <h1 className='text-center text-xl sticky flex items-center justify-center top-0 h-10 bg-slate-800 bg-opacity-85 text-white mb-3 left-1/2 t font-semibold tracking-wide'>Result Shown here</h1>
//                 <div className='px-8 mb-4'>
//                     <p className='text-sm text-gray-800'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Sequi assumenda perspiciatis impedit fugiat voluptatibus optio nihil distinctio sunt error voluptatum quam, facere natus doloribus inventore iure culpa nesciunt earum tenetur nulla eaque maxime aspernatur illo molestiae! Architecto reprehenderit autem est ex perferendis totam officia corrupti, maxime qui saepe expedita possimus distinctio natus, consectetur itaque voluptatibus exercitationem at ullam nesciunt nulla non iste facere quae deleniti? Modi consequatur officiis nesciunt, quos eum explicabo. Possimus libero quasi quo? Labore fugiat officiis, autem doloribus possimus dolore quas quasi sit itaque at beatae in minus voluptates animi magnam qui a totam? Explicabo, quia illo. Lorem ipsum dolor sit amet consectetur adipisicing elit. Unde, at ratione numquam natus saepe, quo odit voluptates minus architecto quos iure non assumenda ex officiis eaque neque vel excepturi, debitis possimus voluptas sequi sunt. In quibusdam voluptates quo saepe, dolores totam nostrum incidunt quisquam debitis at nesciunt, corrupti commodi? Saepe aspernatur similique nesciunt dolorum unde odio facilis natus corporis eius perspiciatis nam tempora ex minus voluptatem dolores excepturi reprehenderit, eos quia ullam libero nisi! Corporis maiores incidunt sapiente expedita omnis officiis facere quod molestias rem, voluptatem doloribus ad magnam, voluptas facilis, reprehenderit maxime? Corrupti laboriosam magnam dignissimos quibusdam voluptatem iure!</p>
//                 </div>
//             </div>
//         </div>



//     )
// }

// export default SoilDiagnosis;







