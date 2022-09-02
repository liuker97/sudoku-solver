import * as React from 'react'
import './GameGrid.scss'
import classNames from "classnames";
import {useEffect, useState} from "react";
const _ = require('lodash')

export default function GameGrid() {

    const [numbers, setNumbers] = useState<string[][]>(Array(9).fill(Array(9).fill('')))
    const getClassNames = (row:number, col:number) =>{
        return classNames({
            'border-r': col===2 || col===5,
            'border-b': row===2 || row===5
         })
    }
    const getFullCandidates = () => ['1','2','3','4','5','6','7','8','9']
    const handleChange = (val:string,rowIndex:number,columnIndex:number)=>{
        setNumbers((prevState)=>{
            const copy = JSON.parse(JSON.stringify(prevState));
            copy[rowIndex][columnIndex] = val
            return copy
        })
    }
    const getSection = (rowIndex:number,columnIndex:number) =>{
        if(rowIndex<3){
            if(columnIndex <3)
                return 1
            if(columnIndex>=3 && columnIndex<=5)
                return 2
            if(columnIndex > 5)
                return 3
        }
        else if(rowIndex>=3 && rowIndex<=5){
            if(columnIndex <3)
                return 4
            if(columnIndex>=3 && columnIndex<=5)
                return 5
            if(columnIndex > 5)
                return 6
        }
        else{
            if(columnIndex <3)
                return 7
            if(columnIndex>=3 && columnIndex<=5)
                return 8
            if(columnIndex > 5)
                return 9
        }
    }
    const getNumberInSection = (section: number) =>{
        const num = []
        for(let i=0;i<9;i++){
            for(let j=0;j<9;j++){
                if(numbers[i][j] && getSection(i,j)===section)
                    num.push(numbers[i][j])
            }
        }
        return num
    }
    const getNumberInRow = (row: number) =>{
        const num = []
        for(let i=0;i<9;i++){
            if(numbers[row][i])
                num.push(numbers[row][i])
        }
        return num
    }
    const getNumberInColumn = (col: number) =>{
        const num = []
        for(let i=0;i<9;i++){
            if(numbers[i][col])
                num.push(numbers[i][col])
        }
        return num
    }
    const getCandidatesForCell = (row:number,col:number) =>{
        if(numbers[row][col])
            return []
        else{
            let candidates = getFullCandidates()
            const section = getSection(row,col)
            const numbersInSection = getNumberInSection(section ?? -1)
            numbersInSection.forEach((num)=>{
                candidates = candidates.filter((e)=>e!==num)
            })

            if(candidates.length === 0)
                return []

            const numbesrInRow = getNumberInRow(row)
            numbesrInRow.forEach((num)=>{
                candidates = candidates.filter((e)=>e!==num)
            })
            if(candidates.length === 0)
                return []

            const numbesrInColumn = getNumberInColumn(col)
            numbesrInColumn.forEach((num)=>{
                candidates = candidates.filter((e)=>e!==num)
            })

            return candidates

        }
    }
    const gameIsFinished = () =>{
        let finished = true
        for(let i=0;i<9 && finished;i++) {
            for (let j = 0; j < 9 && finished; j++) {
                if(numbers[i][j]==='')
                    finished = false
            }
        }
        return finished
    }
    const solve = () =>{

        for(let i=0;i<9;i++){
            for(let j=0;j<9;j++){
                if(numbers[i][j]===''){
                    const candidates = getCandidatesForCell(i,j)
                    console.log("Candidates for cell ",i," ",j," ")
                    console.log(candidates)
                    candidates.forEach((cand)=>{
                        console.log("Checking if ",cand," is unique")
                        if(isUniqueCandidateInSection(cand,i,j))
                            handleChange(cand,i,j)
                        else if( isUniqueCandidateInCol(cand,i,j))
                            handleChange(cand,i,j)
                        else if(isUniqueCandidateInRow(cand,i,j))
                            handleChange(cand,i,j)
                    })

                }

            }
        }

    }
    const isUniqueCandidateInSection = (num: string, row: number, col:number) =>{
        const section = getSection(row,col)
        let isUnique = true
        for(let i=0;i<9 && isUnique;i++) {
            for (let j = 0; j < 9 && isUnique; j++) {
                if(numbers[i][j]==='' && !(i===row && j ===col) && getSection(i,j)===section){
                    const candidatesForCell = getCandidatesForCell(i,j)
                    if(candidatesForCell.find((c)=>c===num))
                        isUnique = false
                }
            }
        }
        console.log("isUniqueCandidateInSection",isUnique)
        return isUnique
    }
    const isUniqueCandidateInRow = (num: string, row: number, col:number) =>{
        let isUnique = true
        for(let i=0;i<9 && isUnique;i++) {
            if(numbers[row][i]==='' && i !==col){
                const candidatesForCell = getCandidatesForCell(row,i)
                if(candidatesForCell.find((c)=>c===num))
                    isUnique = false
            }
        }
        console.log("isUniqueCandidateInRow",isUnique)
        return isUnique
    }
    const isUniqueCandidateInCol = (num: string, row: number, col:number) =>{
        let isUnique = true
        for(let i=0;i<9 && isUnique;i++) {
            if(numbers[i][col]==='' && i !==row){
                const candidatesForCell = getCandidatesForCell(i,col)
                if(candidatesForCell.find((c)=>c===num))
                    isUnique = false
            }
        }
        console.log("isUniqueCandidateInCol",isUnique)
        return isUnique
    }
    return (
        <div className="d-flex flex-row h-100 w-100 justify-content-center align-items-center">
            <table>
                <tbody>
                {numbers.map((row, rowIndex) => (
                    <tr key={rowIndex}>
                        {row.map((column, columnIndex) => (
                            <td key={columnIndex} className={getClassNames(rowIndex,columnIndex)}>
                                <input
                                    key={'cell-'+rowIndex+'-'+columnIndex}
                                    type={"text"}
                                    maxLength={1}
                                    value={numbers[rowIndex][columnIndex]}
                                    onChange={(e)=> {
                                        if(isNaN(+e.target.value))
                                            e.target.value = ''
                                        else
                                            handleChange(e.target.value, rowIndex, columnIndex)
                                    }}
                                />
                            </td>
                        ))}
                    </tr>
                ))}
                </tbody>
            </table>
            <button onClick={()=>console.log(getCandidatesForCell(3,1))}>Candidates for cell 3 1</button>
            <button onClick={()=>solve()}>Solve</button>
        </div>
    )
}
