import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';

const SoilDiagnosis = () => {
    const { control, register, handleSubmit, watch, setValue } = useForm();
    const [isCustom, setIsCustom] = useState(false);
    const selectedOption = watch('irrigation', '');

    const onSubmit = async (data) => {
        console.log(data)
        const irrigation = isCustom ? data.customIrrigation : data.irrigation;
        const file = data.file.split('\\')[2]; 
        console.log(file)


        const formData = new FormData();
        formData.append('rainfall', data.rainfall);
        formData.append('temp', data.temp);
        formData.append('area', data.area);
        formData.append('irrigation', irrigation);
        if (file) {
          formData.append('file', file);
        }
    
      };

    return (
        <div>
            <form className="px-5 py-3 flex flex-col lg:px-10 md:py-6" onSubmit={handleSubmit(onSubmit)}>
                <label htmlFor="rainfall">Rainfall (mm)</label>
                <input
                    className="border-[1px] border-gray-400 outline-none"
                    type="text"
                    id="rainfall"
                    {...register("rainfall", {
                        required: true,
                    })}
                />
                <label htmlFor="temp">Temperature (°C)</label>
                <input
                    className="border-[1px] border-gray-400 outline-none"
                    type="text"
                    id="temp"
                    {...register("temp", {
                        required: true,
                    })}
                    placeholder="Enter the temperature in °C"
                />
                <label htmlFor="area">Land Area (Km²)</label>
                <input
                    className="border-[1px] border-gray-400 outline-none"
                    type="text"
                    id="area"
                    {...register("area", {
                        required: true,
                    })}
                />

                <label htmlFor="irrigation">Irrigation Technique</label>
                <Controller
                    name="irrigation"
                    control={control}
                    defaultValue=""
                    render={({ field }) => (
                        <select
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
                {selectedOption === 'custom' && (
                    <Controller
                        name="customIrrigation"
                        control={control}
                        defaultValue=""
                        render={({ field }) => (
                            <input
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

                <label htmlFor="file">Upload soil report</label>
                <Controller
                    name="file"
                    control={control}
                    defaultValue={[]}
                    render={({ field }) => (
                        <input
                            type="file"
                            onChange={(e) => {
                                field.onChange(e.target.files);
                                console.log(e.target.files)
                            }}
                            {...field}
                        />
                    )}
                />

                <button type="submit">Submit</button>
            </form>
        </div>
    );
};

export default SoilDiagnosis;
